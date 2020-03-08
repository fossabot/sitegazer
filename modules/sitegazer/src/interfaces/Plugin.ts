"use strict";

import Context from "./Context";
import Issue from "./Issue";

export default interface Plugin {
  (context: Context): Promise<Issue[]>;
}
