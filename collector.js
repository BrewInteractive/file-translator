import { glob } from "glob";

export class FileCollector {
  constructor(directory, fileType = "md") {
    this.directory = directory;
    this.fileType = fileType;
    this.files = [];
  }

  async collectFiles() {
    try {
      await this._traverseDirectory(this.directory);
      return this.files;
    } catch (error) {
      console.error("Error collecting files:", error);
    }
  }

  async _traverseDirectory(dir) {
    console.log(dir);
    const files = await glob(dir, { ignore: "node_modules/**" });

    for (const entry of files) {
      if (entry.endsWith(this.fileType)) {
        this.files.push(entry);
      }
    }
  }
}
