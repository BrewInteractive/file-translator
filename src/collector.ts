import { glob } from "glob";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
type File = {
  fileName: string;
  absolutePath: string;
  newPath: string;
};

export class FileCollector {
  public directory: string;
  public fileType: string;
  public files: File[];
  public to: string;

  constructor(directory: string, to: string, fileType = "md") {
    this.directory = directory;
    this.fileType = fileType;
    this.files = [];
    this.to = to;
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
    const files = await glob(`**/*.${this.fileType}`, {
      cwd: dir,
      ignore: "node_modules/**",
      absolute: true,
    });

    for (const entry of files) {
      if (entry.endsWith(this.fileType)) {
        const writeTo = path.join(entry, "../..", this.to);

        const isPathExist = await this.#checkPathExists(writeTo);
        if (!isPathExist) {
          await mkdir(writeTo, { recursive: true });
        }
        this.files.push({
          fileName: path.basename(entry),
          absolutePath: entry,
          newPath: writeTo,
        });
      }
    }
  }

  async #checkPathExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }
}
