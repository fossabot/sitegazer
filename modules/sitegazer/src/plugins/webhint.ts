"use strict";

import { Analyzer } from "hint";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Issue from "../interfaces/Issue";

/**
 * Lint with webhint.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Issue[]>} The promise object of array of Issue.
 */
export default (async (context: Context): Promise<Issue[]> => {
  const webhint: Analyzer = Analyzer.create({
    extends: [ "web-recommended" ],
    // connector: {
    //   name: "jsdom",
    // },
    // hints: {
    //   "html-checker": [ "error", {
    //     details: true,
    //   }],
    // },
    formatters: [],
  });
  const results = await webhint.analyze(context.url);
  const issues: Issue[] = [];

  for (const result of results) {
    for (const problem of result.problems) {
      issues.push({
        pageURL: result.url,
        fileURL: result.url,
        deviceType: context.deviceType,
        pluginName: "WebHint",
        message: problem.message,
        line: 0,
        column: 0,
      });
    }
  }

  return issues;
}) as Plugin;
