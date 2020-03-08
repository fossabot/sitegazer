"use strict";

export default interface Issue {
  url: string;
  deviceType: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
