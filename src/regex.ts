import { SIGN } from "./util/constants.js";

export class Regexp {
  static base64 = new RegExp(
    "(?:[A-Za-z0-9+/]{4}){15,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?",
    "g"
  );

  static sign = new RegExp(`${SIGN}(.*?)${SIGN}`, "gs");
}
