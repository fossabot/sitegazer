"use strict";

import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Issue from "../interfaces/Issue";

/**
 * Find browser errors.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Issue[]>} The promise object of array of Issue.
 */
export default (async (context: Context): Promise<Issue[]> => context.browserErrors.map(error => ({
  url: context.url,
  deviceType: context.deviceType,
  pluginName: "Chrome Console",
  message: error.toString(),
  line: 0,
  column: 0,
}))) as Plugin;
