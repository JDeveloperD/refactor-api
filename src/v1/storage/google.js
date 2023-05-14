const { Storage } = require("@google-cloud/storage");
const { config } = require("../../../config");

class Bucket {
  constructor(pathKey, nameBucket) {
    this.keyFilename = pathKey;
    this.setBucket = nameBucket;

    this.storage = new Storage({
      keyFilename: this.keyFilename,
    });
  }

  getName() {
    return this.setBucket.toString();
  }

  async createBucket(nameDirectory) {
    await this.storage.createBucket(nameDirectory);
  }

  async getBuckets() {
    return await this.storage.getBuckets();
  }

  async getFiles(folder = "/", viewSubFolders = false) {
    const options = {
      prefix: folder,
      delimiter: !viewSubFolders ? "/" : "",
    };

    const [files] = await this.storage
      .bucket(this.getName())
      .getFiles(folder === "/" ? null : options);

    return files.map((file) => {
      return { nameFile: file.name };
    });
  }

  async deleteFile(/** @type {any} */ pathFile) {
    try {
      if (pathFile === undefined) {
        throw new Error("Datos no definidos en función");
      }

      await this.storage.bucket(this.getName()).file(`${pathFile}`).delete();
      return true;
    } catch (e) {
      throw new Error(e.name + ": " + e.message);
    }
  }

  async uploadFile(
    /** @type {string} */ fileName,
    filePathUpload,
    pathDestino
  ) {
    try {
      await this.storage.bucket(this.getName()).upload(filePathUpload, {
        destination: `${pathDestino}${fileName}`,
        gzip: true,
      });

      await this.storage
        .bucket(this.getName())
        .file(`${pathDestino}${fileName}`)
        .setMetadata({ cacheControl: "no-cache" });
    } catch (e) {
      console.log(e);
      throw new Error(e.name + ": " + e.message);
    }
  }
}

const { NAME, PATH_KEY } = config.BUCKETS;

module.exports = new Bucket(PATH_KEY, NAME);
