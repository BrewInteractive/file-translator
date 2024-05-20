import { SIGN } from "./util/constants.js";

export class Parser {
  // Function to update the text by replaceWith fn
  replaceText: UpdateTextFn = ({ text, pattern, replaceWith }) => {
    const extractedText = this.#extractWithRegex(text, pattern);

    let updatedText = text;

    extractedText.forEach((item) => {
      updatedText = updatedText.replace(item, replaceWith(item));
    });

    return updatedText;
  };

  #extractWithRegex(text: string, pattern: RegExp): string[] {
    const matches = text.match(pattern);

    return matches ?? [];
  }

  // Function to decode Base64 to normal text
  decodeBase64(text: string): string {
    try {
      return SIGN.concat(atob(text)).concat(SIGN);
    } catch (e) {
      console.error("Invalid Base64 string:", text);
      return text;
    }
  }

  encodeBase64(text: string) {
    return btoa(unescape(encodeURIComponent(this.#removeSign(text))));
  }

  #removeSign(text: string) {
    return text.replace(new RegExp(SIGN, "g"), "");
  }
}

type ReplaceWithFn = (matchText: string) => string;
type UpdateTextFn = (args: {
  text: string;
  pattern: RegExp;
  replaceWith: ReplaceWithFn;
}) => string;
