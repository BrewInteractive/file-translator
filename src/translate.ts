#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import figlet from "figlet";
import { AI } from "./ai.js";

console.log(figlet.textSync("Brew File Translator"));

const program = new Command();

program
  .name("Translate Files (md)")
  .description("CLI to translate files with using OpenAI API")
  .version("0.0.1");

program
  .option("-d, --dir <dir>", "glob pattern match of files")
  .option("-f, --from <from>", "the language translate from")
  .option("-t, --to <to...>", "the language translate from")
  .action(async (options, command) => {
    console.log({ options });

    if (
      !options.dir ||
      !options.from ||
      !options.to ||
      options.to.length === 0
    ) {
      console.log("please enter from, to, dir");

      return;
    }
    const ai = new AI();
    ai.translateAndWriteToFile(options.from, options.to[0], options.dir);
  });

program.parse();
