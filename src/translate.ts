#!/usr/bin/node

import { Command } from "@commander-js/extra-typings";
import figlet from "figlet";
import { AI } from "./ai.js";

const ai = new AI();

console.log(figlet.textSync("Brew File Translator"));

const program = new Command();

program
  .name("Translate Files (md)")
  .description("CLI to translate files with using OpenAI API")
  .version("0.0.1");

program
  .argument("d, dir <dir>", "glob pattern match of files")
  .argument("f, from <from>", "the language translate from")
  .argument("t, to <to...>", "the language translate from")
  .action(async (dir, from, to) => {
    const ai = new AI();
    ai.translateAndWriteToFile(from, to, dir);
  });

program.parse();
