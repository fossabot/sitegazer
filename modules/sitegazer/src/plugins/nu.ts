"use strict";

import { vnu } from "vnu";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Issue from "../interfaces/Issue";

/**
 * Lint with Nu HTML Checker.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Issue[]>} The promise object of array of Issue.
 */
export default (async (context: Context): Promise<Issue[]> => {
  const warnings = await vnu(context.html);

  return warnings.map(warning => ({
    url: context.url,
    deviceType: context.deviceType,
    pluginName: "Nu HTML Checker",
    message: warning.message,
    line: warning.lastLine,
    column: warning.firstColumn,
  }));
}) as Plugin;
