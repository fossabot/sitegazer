"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const port = 1234;
const url = `http://localhost:${port}/`;

let server: Server;

beforeEach(async () => {
  server = new Server(port);
  await server.start();
});

afterEach(async () => {
  await server.close();
});

test("Chrome Console Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "chrome-console" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      pageURL: `http://localhost:${port}/`,
      fileURL: `http://localhost:${port}/`,
      deviceType: "desktop",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: `Error: Error: Something is wrong in desktop site.\n    at http://localhost:${port}/:7:23`,
    },
    {
      pageURL: `http://localhost:${port}/`,
      fileURL: `http://localhost:${port}/`,
      deviceType: "mobile",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: `Error: Error: Something is wrong in mobile site.\n    at http://localhost:${port}/:8:23`,
    },
  ]));
}, 20000);
