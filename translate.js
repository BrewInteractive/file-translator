import { Command } from "commander";
import { FileCollector } from "./collector.js";
const program = new Command();

program
  .name("Translate Files (md)")
  .description("CLI to translate files with using OpenAI API")
  .version("0.0.1");

program.option("-d, --dir [dir]", "glob pattern match of files");

program.parse();
const options = program.opts();

const collector = new FileCollector(options.dir);
console.log(await collector.collectFiles());
