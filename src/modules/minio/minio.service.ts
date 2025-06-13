import { Injectable, Logger } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MinioService {
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

    this.initializeBucket().then(() =>
      this.logger.log(
        `MinIO service initialized with bucket: ${this.bucketName}`,
      ),
    );
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
  async uploadFiles(
    files: Array<Express.Multer.File>,
    key: string,
  ): Promise<string[]> {
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
      return uploadedFileNames;
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

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        this.logger.warn(`No files found with prefix "${key}_"`);
        return [];
      }

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
      const listParams = {
        Bucket: this.bucketName,
        Prefix: `${key}_`,
      };

      const listedObjects = await this.s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        this.logger.warn(`No files found with prefix "${key}_"`);
        return;
      }

      const objectsToDelete = listedObjects.Contents.map(({ Key }) => ({
        Key: Key as string,
      })).filter((obj) => obj.Key !== undefined);

      if (objectsToDelete.length > 0) {
        await this.s3
          .deleteObjects({
            Bucket: this.bucketName,
            Delete: { Objects: objectsToDelete },
          })
          .promise();

        this.logger.log(
          `Deleted ${objectsToDelete.length} file(s) with prefix "${key}_"`,
        );
      }

      if (listedObjects.IsTruncated) {
        await this.deleteFiles(key);
      }
    } catch (error) {
      this.logger.error(`Error deleting files: ${error.message}`);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }
}
