"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const port = 2345;
const url = `http://localhost:${port}`;

let server: Server;

beforeEach(async () => {
  server = new Server(port);
  await server.start();
});

afterEach(async () => {
  await server.close();
});

test("Nu HTML Checker Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      pageURL: `http://localhost:${port}/`,
      fileURL: `http://localhost:${port}/`,
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 26,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      pageURL: `http://localhost:${port}/`,
      fileURL: `http://localhost:${port}/`,
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 26,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    // This error message ensures that mobile user agent is properly working
    {
      pageURL: `http://localhost:${port}/`,
      fileURL: `http://localhost:${port}/`,
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 6,
      column: 15,
      message: "Consider avoiding viewport values that prevent users from resizing documents.",
    },
  ]));
}, 30000);
