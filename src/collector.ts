import { glob } from "glob";

export class FileCollector {
  public directory: string;
  public fileType: string;
  public files: string[];

  constructor(directory: string, fileType = "md") {
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

  private async _traverseDirectory(dir: string) {
    console.log(dir);
    const files = await glob(dir, { ignore: "node_modules/**" });

    for (const entry of files) {
      if (entry.endsWith(this.fileType)) {
        this.files.push(entry);
      }
    }
  }
}
