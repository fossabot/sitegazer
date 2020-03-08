import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const port = 3456;
const url = `http://localhost:${port}`;
const inexistentURL = "http://localhost:7171";

let server: Server;

beforeEach(async () => {
  server = new Server(port);
  await server.start();
});

afterEach(async () => {
  await server.close();
});

test("SiteGazer crawl the URLs in the page when crawl: true is given", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: true,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: `http://localhost:${port}/`,
      deviceType: "desktop",
      file: [{
        url: `http://localhost:${port}/`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 26,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [
          {
            pluginName: "Nu HTML Checker",
            line: 3,
            column: 26,
            message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 6,
            column: 15,
            message: "Consider avoiding viewport values that prevent users from resizing documents.",
          },
        ],
      }],
    },
    {
      url: `http://localhost:${port}/link1`,
      deviceType: "desktop",
      file: [{
        url: `http://localhost:${port}/link1`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 24,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/link1`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/link1`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 24,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/link2`,
      deviceType: "desktop",
      files: [{
        url: `http://localhost:${port}/link2`,
        issues: [
          {
            pluginName: "Nu HTML Checker",
            line: 11,
            column: 11,
            message: "End tag for  “body” seen, but there were unclosed elements.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 10,
            column: 13,
            message: "Unclosed element “span”.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 3,
            column: 24,
            message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
          },
        ],
      }],
    },
    {
      url: `http://localhost:${port}/link2`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/link2`,
        issues: [
          {
            pluginName: "Nu HTML Checker",
            line: 11,
            column: 11,
            message: "End tag for  “body” seen, but there were unclosed elements.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 10,
            column: 13,
            message: "Unclosed element “span”.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 3,
            column: 24,
            message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
          },
        ],
      }],
    },
  ]));
}, 50000);

test("SiteGazer lint only the given URLs when crawl: false is given", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: `http://localhost:${port}/`,
      deviceType: "desktop",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 26,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [
          {
            pluginName: "Nu HTML Checker",
            line: 3,
            column: 26,
            message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 6,
            column: 15,
            message: "Consider avoiding viewport values that prevent users from resizing documents.",
          },
        ],
      }],
    },
  ]));
}, 30000);

test("SiteGazer lint URLs in sitemap.xml when sitemap: true is given", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: true,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: `http://localhost:${port}/`,
      deviceType: "desktop",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 26,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [
          {
            pluginName: "Nu HTML Checker",
            line: 3,
            column: 26,
            message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
          },
          {
            pluginName: "Nu HTML Checker",
            line: 6,
            column: 15,
            message: "Consider avoiding viewport values that prevent users from resizing documents.",
          },
        ],
      }],
    },
    {
      url: `http://localhost:${port}/sitemapped`,
      deviceType: "desktop",
      files: [{
        url: `http://localhost:${port}/sitemapped`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 24,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/sitemapped`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/sitemapped`,
        issues: [{
          pluginName: "Nu HTML Checker",
          line: 3,
          column: 24,
          message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
        }],
      }],
    },
  ]));
}, 30000);

test("SiteGazer returns error when no URL is given", async () => {
  const sitegazer = new SiteGazer({
    urls: [],
    sitemap: false,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: null,
      deviceType: null,
      files: [{
        url: null,
        issues: [{
          pluginName: null,
          line: 1,
          column: 1,
          message: "No URL is given.",
        }],
      }],
    },
  ]));
}, 30000);

test("SiteGazer returns an error if specified host doesn't respond.", async () => {
  const sitegazer = new SiteGazer({
    urls: [
      inexistentURL,
    ],
    sitemap: false,
    crawl: true,
    plugins: [],
  });
  const results = await sitegazer.run();

  expect(results).toEqual(sortObjects([
    {
      url: "http://localhost:7171/",
      deviceType: "desktop",
      files: [{
        url: "http://localhost:7171/",
        issues: [{
          pluginName: null,
          message: "Error: Connection refused to localhost:7171. (ERR_CONNECTION_REFUSED)",
          line: 1,
          column: 1,
        }],
      }],
    },
    {
      url: "http://localhost:7171/",
      deviceType: "mobile",
      files: [{
        url: "http://localhost:7171/",
        issues: [{
          pluginName: null,
          message: "Error: Connection refused to localhost:7171. (ERR_CONNECTION_REFUSED)",
          line: 1,
          column: 1,
        }],
      }],
    },
  ]));
}, 30000);

test("SiteGazer returns an error on TLS error.", async () => {
  const sitegazer = new SiteGazer({
    urls: [ `https://localhost:${port}` ], // https:// access to the server which does not support https
    sitemap: false,
    crawl: true,
    plugins: [],
  });
  const results = await sitegazer.run();

  expect(results).toEqual(sortObjects([
    {
      url: `https://localhost:${port}/`,
      deviceType: "desktop",
      files: [{
        url: `https://localhost:${port}/`,
        issues: [{
          pluginName: null,
          message: "Error: SSL error. (ERR_SSL_PROTOCOL_ERROR)",
          line: 1,
          column: 1,
        }],
      }],
    },
    {
      url: `https://localhost:${port}/`,
      deviceType: "mobile",
      files: [{
        url: `https://localhost:${port}/`,
        issues: [{
          pluginName: null,
          message: "Error: SSL error. (ERR_SSL_PROTOCOL_ERROR)",
          line: 1,
          column: 1,
        }],
      }],
    },
  ]));
});
