"use strict";

export default interface Warning {
  url: string;
  deviceType: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
