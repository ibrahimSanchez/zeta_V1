import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body,
  Res,
  UploadedFiles,
  NotFoundException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MinioService } from "./minio.service";
import { Public } from "../auth/decorators/public.decorator";
import { Response } from "express";
import * as archiver from "archiver";

@Controller("files")
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Public()
  @Post("upload")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: { key: string },
  ) {
    if (!files || files.length === 0) {
      throw new Error("No file uploaded");
    }

    return this.minioService.uploadFiles(files, data.key);
  }

  @Public()
  @Get(":key")
  async getFile(@Param("key") key: string, @Res() res: Response) {
    // return await this.minioService.getFileStream(key);
    const { stream, meta } = await this.minioService.downloadFileByKey(key);

    res.set({
      "Content-Type": meta.contentType,
      "Content-Length": meta.contentLength,
      "Content-Disposition": `attachment; filename="${key}"`,
    });

    stream.pipe(res);
  }

  @Public()
  @Get("download-all/:key")
  async downloadAllFiles(@Param("key") key: string, @Res() res: Response) {
    const files = await this.minioService.getFilesByKeyPrefix(key);

    if (files.length === 0) {
      throw new NotFoundException("No files found");
    }

    const archive = archiver("zip");
    archive.on("error", (err) => {
      throw new Error(`Failed to create ZIP: ${err.message}`);
    });

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${key}_files.zip"`,
    });

    archive.pipe(res);

    for (const file of files) {
      archive.append(file.stream, { name: file.meta.filename });
    }

    await archive.finalize();
  }

  @Public()
  @Delete("delete/:key")
  async deleteFile(@Param("key") key: string) {
    return await this.minioService.deleteFiles(key);
  }

  @Public()
  @Get("all/:key")
  async getFilesByKeyPrefix(@Param("key") key: string) {
    const files = await this.minioService.getFilesByKeyPrefix(key);
    return {
      count: files.length,
      files: files.map((file) => ({
        filename: file.meta.filename,
        size: file.meta.contentLength,
        type: file.meta.contentType,
      })),
    };
  }
}
