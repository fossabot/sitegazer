import * as puppeteer from "puppeteer";
import Sitemapper from "sitemapper";

import Config from "./interfaces/Config";
import Plugin from "./interfaces/Plugin";
import Issue from "./interfaces/Issue";
import { deduplicate, sleep } from "./utils";

const interval = 2000;

class SiteGazer {
  private issues: Issue[] = [];
  private plugins: Plugin[];
  private config: Config;

  private urlsToCrawl: string[] = [];
  private processedURLs: string[] = [];

  private hostsToCrawl: string[] = [];

  private userAgents: object = {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
  };

  public constructor(config: Config) {
    this.config = config;

    if (this.config.urls.length < 1) {
      this.issues.push({
        pageURL: null,
        fileURL: null,
        deviceType: null,
        pluginName: null,
        message: "No URL is given.",
        line: 1,
        column: 1,
      });
    }

    this.plugins = this.config.plugins.map(plugin => require(`./plugins/${plugin}`).default);

    this.addURLs(config.urls);
  }

  private addURLs(urls: string[]|URL[]): void {
    let _urls: (string|URL)[];

    if (Array.isArray(urls)) {
      _urls = urls;
    } else {
      _urls = [ urls ];
    }

    const urlStrings: string[] = _urls.map((url: string|URL) =>
      (typeof url === "string") ? new URL(url).href : url.href);

    for (const [ i, url ] of urlStrings.entries()) {
      if (
        this.urlsToCrawl.includes(url) ||
        this.processedURLs.includes(url)
      ) {
        urlStrings.splice(0, i + 1);
      }
    }

    this.urlsToCrawl = this.urlsToCrawl.concat(urlStrings);

    this.hostsToCrawl = deduplicate(this.urlsToCrawl.map(url => new URL(url).host));
  }

  private async loadPage(url: string, deviceType: string, userAgent: string): Promise<void> {
    const errors: Error[] = [];
    const onError = (err: Error): void => {
      errors.push(err);
    };

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setUserAgent(userAgent);
    page.on("pageerror", onError);
    page.on("error", onError);

    try {
      const res = await page.goto(url);
      const pageURL = page.url();
      const html = await res.text();

      if (!res.ok()) {
        this.issues.push({
          pageURL,
          fileURL: pageURL,
          deviceType,
          pluginName: null,
          message: `Error: Request failure for ${url}. ${res.status()}: ${res.statusText()}`,
          line: 1,
          column: 1,
        });
      }

      // Parse links & add
      if (this.config.crawl) {
        for (const a of await page.$$("a")) {
          const urlInPage = new URL(await (await a.getProperty("href")).jsonValue() as string);

          if (this.hostsToCrawl.includes(urlInPage.host)) {
            this.addURLs([ urlInPage ]);
          }
        }
      }

      await browser.close();

      return this.processURL(pageURL, html, deviceType, userAgent, errors);
    } catch (err) {
      if (err.message.startsWith("net::ERR_CONNECTION_REFUSED")) {
        this.issues.push({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: `Error: Connection refused to ${new URL(url).host}. (ERR_CONNECTION_REFUSED)`,
          line: 1,
          column: 1,
        });
      } else if (err.message.startsWith("net::ERR_SSL_PROTOCOL_ERROR")) {
        this.issues.push({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: "Error: SSL error. (ERR_SSL_PROTOCOL_ERROR)",
          line: 1,
          column: 1,
        });
      } else {
        this.issues.push({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: `Error: Unexpected error on browser access: ${err.toString()}`,
          line: 1,
          column: 1,
        });
      }
    }
  }

  private async processURL(url: string, html: string, deviceType: string, userAgent: string, browserErrors: Error[]): Promise<void> {
    console.info(`Processed ${url} (${deviceType})`);

    for (const plugin of this.plugins) {
      const warnings = await plugin({
        url: url,
        html,
        deviceType,
        userAgent,
        browserErrors,
      });

      this.issues = this.issues.concat(warnings);
    }
  }

  private async parseSiteMap(): Promise<void> {
    let pages: string[] = [];

    for (const host of this.hostsToCrawl) {
      const sitemapper = new Sitemapper({
        url: `http://${host}/sitemap.xml`,
        timeout: 30000,
      });
      const sitemap = await sitemapper.fetch();
      pages = pages.concat(sitemap.sites);
    }

    this.addURLs(pages);
  }

  public async run(): Promise<Issue[]> {
    if (this.config.sitemap === true) {
      this.parseSiteMap();
    }

    while (true) {
      const url = this.urlsToCrawl.shift();
      this.processedURLs.push(url);

      if (url === undefined) {
        break;
      }

      for (const [ deviceType, userAgent ] of Object.entries(this.userAgents)) {
        await this.loadPage(url, deviceType, userAgent);
        await sleep(interval);
      }
    }

    return this.issues;
  }
}

export default SiteGazer;
