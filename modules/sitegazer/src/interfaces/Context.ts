"use strict";

import Issue from "./Issue";

export default interface Context {
  url: string;
  html: string;
  deviceType: string;
  userAgent: string;
  issues: Issue[];
}
