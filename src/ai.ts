import OpenAI from "openai";
import { FileCollector } from "./collector.js";
import { access, constants, readFile, writeFile } from "fs/promises";
import { Parser } from "./parser.js";
import { Regexp } from "./regex.js";
import path from "node:path";

export class AI {
  #apiKey: string;
  #organizationKey: string;
  #client: OpenAI;

  constructor() {
    this.#apiKey = process.env.API_KEY!;
    this.#organizationKey = process.env.ORG_KEY!;
    this.#client = new OpenAI({
      apiKey: this.#apiKey,
      organization: this.#organizationKey,
    });
  }

  async translateAndWriteToFile(from: string, to: string, directory: string) {
    const collector = new FileCollector({ directory, to, from });
    const files = await collector.collectFiles();

    files?.forEach(async (file, index) => {
      setTimeout(async () => {
        const content = await readFile(file.absolutePath, "utf8");
        const parser = new Parser();
        const replacedText = parser.replaceText({
          text: content,
          pattern: Regexp.base64,
          replaceWith: (text) => {
            return parser.decodeBase64(text);
          },
        });
        const res = await this.#client.chat.completions.create({
          messages: [
            { role: "system", content: this.#getSystemProp(from, to) },
            { role: "user", content: replacedText },
          ],
          model: "gpt-4o",
          temperature: 0,
        });

        if (res.choices[0].message.content) {
          const translatedText = parser.replaceText({
            text: res.choices[0].message.content,
            pattern: Regexp.sign,
            replaceWith: (text) => {
              return parser.encodeBase64(text);
            },
          });

          const newFilePath = path.join(file.newPath, file.fileName);
          await writeFile(newFilePath, translatedText, "utf-8");
        }
      }, (index + 1) * 2000);
    });
  }

  // Function to get system prop based on from and to languages
  #getSystemProp = (from: string, to: string) => {
    return `You are an advanced translation assistant tasked with translating text from ${from} to ${to}. The text contains various sections such as titles, headers, labels, and specifically, some components in JSON format. Translate all visible ${from} text into ${to}, maintaining accuracy and appropriate cultural context. Maintain the original markdown structure and formatting in the output.  Make sure to parse through the entire document, translating all text fields including those embedded within JSON. ** and # special characters for markdown file, keep them as it is while translating, proper nouns should also remain as they are. Don't enclose the files with extra yaml tag`;
  };
}
