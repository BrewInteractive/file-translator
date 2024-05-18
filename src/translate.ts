#!/usr/bin/node

import { Command } from "@commander-js/extra-typings";
import { FileCollector } from "./collector.js";
import figlet from "figlet";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
  organization: "",
});

console.log(figlet.textSync("Brew File Translator"));
const sign = "__b_decoded__";

const systemPromp = `You are an advanced translation assistant tasked with translating a markdown file from English to Arabic. The file contains various sections such as titles, headers, labels, and specifically, some components in JSON format. Translate all visible English text into Arabic, maintaining accuracy and appropriate cultural context. Maintain the original markdown structure and formatting in the output.  Make sure to parse through the entire document, translating all text fields including those embedded within JSON. The final output should be the translated markdown file, fully formatted and ready to use. Don't translate ${sign} text`;

const program = new Command();

program
  .name("Translate Files (md)")
  .description("CLI to translate files with using OpenAI API")
  .version("0.0.1");

program
  .option("-d, --dir [dir]", "glob pattern match of files")
  .option("f, from [from]", "the language translate from")
  // .option("t, to <to...>", "the language translate from")
  .argument("t, to <to...>", "the language translate from")
  .action(async (...args) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(
      __dirname,
      "files",
      "azure-logic-apps-ile-uygulamalarinizi-entegre-edin.md"
    );
    const content = await readFile(filePath, "utf-8");

    const updatedContent = updateTextWithDecodedBase64(content);
    // console.log({ updatedContent });

    const res = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPromp },
        { role: "user", content: updatedContent },
      ],
      model: "gpt-4o",
    });
    console.log({ res: JSON.stringify(res) });

    const encodedTextRegex = `/${sign}.*?${sign}/gs`;
    const matches = res.choices[0].message.content?.match(encodedTextRegex);
    //TODO: encode matches and replace in place

    // await writeFile(filePath, updatedContent, "utf-8");
  });

program.parse();

// Define the regex pattern for Base64
const base64Pattern =
  /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;

// Function to extract Base64 strings
function extractBase64Strings(text: string): string[] {
  const matches = text
    .match(base64Pattern)
    ?.filter((text) => text.split("").length > 0 && text.length > 60);

  return matches ?? [];
}

// Function to decode Base64 to normal text
function decodeBase64(base64: string): string {
  try {
    return atob(base64); // Decode Base64 string to normal text
  } catch (e) {
    console.error("Invalid Base64 string:", base64);
    return base64; // Return the original string if decoding fails
  }
}

// Function to update the text by decoding all Base64 strings
function updateTextWithDecodedBase64(text: string): string {
  const base64Strings = extractBase64Strings(text);

  let updatedText = text;

  console.log({ length: base64Strings.length });

  base64Strings
    .filter((base64) => base64.split("").length > 0)
    .forEach((base64) => {
      const decoded = sign.concat(decodeBase64(base64)).concat(sign);
      updatedText = updatedText.replace(base64, decoded);
    });

  return updatedText;
}
