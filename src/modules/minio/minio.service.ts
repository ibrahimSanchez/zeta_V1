import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private s3: S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>("MINIO_BUCKET_NAME") || "my-bucket";

    this.s3 = new S3({
      endpoint: this.configService.get<string>("MINIO_ENDPOINT"),
      accessKeyId: this.configService.get<string>("MINIO_ACCESS_KEY"),
      secretAccessKey: this.configService.get<string>("MINIO_SECRET_KEY"),
      s3ForcePathStyle: true,
      signatureVersion: "v4",
    });
  }

  async onModuleInit() {
    try {
      await this.initializeBucket();
      this.logger.log(
        `MinIO service initialized with bucket: ${this.bucketName}`,
      );
    } catch (error) {
      this.logger.error(`MinIO is not available: ${error.message}`);
    }
  }

  private async initializeBucket(): Promise<void> {
    try {
      const exists = await this.s3
        .headBucket({ Bucket: this.bucketName })
        .promise()
        .then(() => true)
        .catch((err) => {
          if (err.statusCode === 404) return false;
          throw err;
        });

      if (!exists) {
        await this.s3.createBucket({ Bucket: this.bucketName }).promise();
        this.logger.log(`Bucket ${this.bucketName} created successfully`);
      }
    } catch (error) {
      this.logger.error(`Error initializing MinIO bucket: ${error.message}`);
      throw error;
    }
  }
  //Todo **********************************************************************************************
  async uploadFiles(files: Array<Express.Multer.File>, key: string) {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const uploadedFileNames: string[] = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          const { originalname, buffer, mimetype } = file;

          const fileExtension = originalname.split(".").pop();
          const uniqueFileName = `${key}_${uuidv4()}.${fileExtension}`;

          await this.s3
            .putObject({
              Bucket: this.bucketName,
              Key: uniqueFileName,
              Body: buffer,
              ContentType: mimetype,
            })
            .promise();

          uploadedFileNames.push(uniqueFileName);
        }),
      );

      this.logger.log(
        `Uploaded ${files.length} file(s) to bucket "${this.bucketName}"`,
      );
      const resUpload = {
        files: uploadedFileNames,
      };

      return resUpload;
    } catch (error) {
      this.logger.error(`Failed to upload files: ${error.message}`);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  //Todo **********************************************************************************************
  async downloadFileByKey(key: string): Promise<{
    stream: Readable;
    meta: { contentType: string; contentLength: number };
  }> {
    try {
      try {
        await this.s3
          .headObject({
            Bucket: this.bucketName,
            Key: key,
          })
          .promise();
      } catch (headError) {
        if (headError.name === "NotFound") {
          throw new Error(`The file with key ${key} does not exist in storage`);
        }
        throw headError;
      }

      const data = await this.s3
        .getObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();

      const stream = new Readable();
      stream.push(data.Body);
      stream.push(null);

      return {
        stream,
        meta: {
          contentType: data.ContentType || "application/octet-stream",
          contentLength: data.ContentLength || 0,
        },
      };
    } catch (error) {
      this.logger.error(`Error retrieving file ${key}: ${error.message}`);

      if (error.message.includes("no existe")) {
        throw new NotFoundException(error.message);
      }

      throw new Error(`Failed to retrieve file: ${error.message}`);
    }
  }

  //Todo **********************************************************************************************
  async getFilesByKeyPrefix(key: string): Promise<
    Array<{
      stream: Readable;
      meta: {
        contentType: string;
        contentLength: number;
        filename: string;
      };
    }>
  > {
    if (!key) {
      throw new Error("Key is required");
    }

    try {
      const listParams = {
        Bucket: this.bucketName,
        Prefix: `${key}_`,
      };

      const listedObjects = await this.s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0)
        return [];

      const validObjects = listedObjects.Contents.filter(
        (obj): obj is { Key: string } => obj.Key !== undefined,
      );

      const files = await Promise.all(
        validObjects.map(async ({ Key }) => {
          const data = await this.s3
            .getObject({
              Bucket: this.bucketName,
              Key,
            })
            .promise();

          const stream = new Readable();
          stream.push(data.Body);
          stream.push(null);

          return {
            stream,
            meta: {
              contentType: data.ContentType || "application/octet-stream",
              contentLength: data.ContentLength || 0,
              filename: Key,
            },
          };
        }),
      );

      return files;
    } catch (error) {
      this.logger.error(`Error retrieving files: ${error.message}`);
      throw new Error(`Failed to retrieve files: ${error.message}`);
    }
  }

  //Todo **********************************************************************************************
  async deleteFiles(key: string): Promise<void> {
  if (!key) {
    throw new Error("Key is required");
  }

  try {
    await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();

    this.logger.log(`Deleted file with key "${key}"`);
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      this.logger.warn(`No file found with key "${key}"`);
      return;
    }

    this.logger.error(`Error deleting file: ${error.message}`);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

}
