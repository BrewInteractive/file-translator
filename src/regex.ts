import { SIGN } from "./util/constants.js";

export class Regexp {
  static readonly base64 =
    /(?:[A-Za-z0-9+/]{4}){10,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;

  static readonly sign = new RegExp(`${SIGN}(.*?)${SIGN}`, "gs");
}
