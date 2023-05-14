const { Storage } = require("@google-cloud/storage");
const { config } = require("../../config");

class Bucket {
  constructor(pathKey, nameBucket, origin) {
    this.keyFilename = pathKey;
    this.setBucketName = nameBucket;
    this.origin = origin;

    this.storage = new Storage({
      keyFilename: this.keyFilename,
    });
  }

  async configureBucketCors() {
    await this.storage.bucket(this.setBucketName).setCorsConfiguration([
      {
        method: ["GET", "POST", "PUT", "DELETE"],
        origin: this.origin,
        responseHeader: ["Content-Type"],
        maxAgeSeconds: 3600,
      },
    ]);

    console.log(`Bucket ${
      this.setBucketName
    } Se hizo lan config CORS para el metodo ${"GET"} requests desdes el ${
      this.origin
    } con
        ${"Content-Type"} responses across origins`);
  }

  getName() {
    this.configureBucketCors().catch(console.error);
    return this.setBucketName.toString();
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

const { NAME, PATH_KEY, ORIGIN } = config.BUCKETS;

module.exports = new Bucket(PATH_KEY, NAME, ORIGIN);
