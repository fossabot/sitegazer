import { sortBy } from "lodash";

import Issue from "./interfaces/Issue";
import Page from "./interfaces/Page";

/*
 * Example:
 *
 * {
 *   desktop: {
 *     "https://example.com/foo.html": {
 *       "https://example.com/foo.js": {
 *         pluginName: "Chrome Console",
 *         message: "Error: Something went wrong",
 *         line: 5,
 *         column: 14,
 *       },
 *       "https://example.com/boo.js": {
 *         pluginName: "Chrome Console",
 *         message: "Error: Something went wrong",
 *         line: 12,
 *         column: 11,
 *       }
 *     },
 *     "https://example.com/bar.html": {
 *       "https://example.com/bar.js": {
 *         pluginName: "Chrome Console",
 *         message: "Error: Something went wrong",
 *         line: 2,
 *         column: 6,
 *       },
 *     }
 *   },
 *   mobile: { ... }
 * }
 */
interface InternalResultFormat {
  [deviceType: string]: {
    [pageURL: string]: {
      [fileURL: string]: {
        pluginName: string;
        message: string;
        line: number;
        column: number;
      }[];
    };
  };
}

export default class Results {
  private results: InternalResultFormat = {};

  public add(issues: Issue|Issue[]): void {
    const _issues = (Array.isArray(issues)) ? issues : [ issues ];

    for (const issue of _issues) {
      if (typeof this.results[issue.deviceType] !== "object") {
        this.results[issue.deviceType] = {};
      }
      if (typeof this.results[issue.deviceType][issue.pageURL] !== "object") {
        this.results[issue.deviceType][issue.pageURL] = {};
      }
      if (!Array.isArray(this.results[issue.deviceType][issue.pageURL][issue.fileURL])) {
        this.results[issue.deviceType][issue.pageURL][issue.fileURL] = [];
      }

      this.results[issue.deviceType][issue.pageURL][issue.fileURL].push({
        pluginName: issue.pluginName,
        message: issue.message,
        line: issue.line,
        column: issue.column,
      });
    }
  }

  public toJSON(): Page[] {
    let pages: Page[] = [];

    for (const [ deviceType, internalPages ] of Object.entries(this.results)) {
      const _pages = sortBy(Object.entries(internalPages).map(([ pageURL, files ]) => ({
        url: pageURL,
        deviceType,
        files: sortBy(Object.entries(files).map(([ fileURL, issues ]) => ({
          url: fileURL,
          issues: sortBy(issues, [ "line", "column", "pluginName" ]),
        })), [ "url" ]),
      })), [ "url", "deviceType" ]);

      pages = pages.concat(_pages);
    }

    return pages;
  }
}
