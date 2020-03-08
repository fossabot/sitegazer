"use strict";

export default interface Issue {
  pageURL: string;
  fileURL: string;
  deviceType: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
