import { ApiProperty } from "@nestjs/swagger";

export class SwaggerUploadDto {
  @ApiProperty({
    description: "Array de archivos PDF a subir",
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
    required: true,
    example: ["documento1.pdf", "documento2.pdf"],
  })
  files: Express.Multer.File[];

  @ApiProperty({
    description: "Clave única para identificar los documentos PDF subidos",
    example: "factura-2023-001",
    required: true,
  })
  key: string;
}

export class SwaggerUploadResponseDto {
  @ApiProperty({
    description: "Array of uploaded file URLs",
    example: [
      "file_2_ab1881e6-2507-448d-9b73-6a96f8413da9.png",
      "file_2_ab1881e6-2507-448d-9b73-6dadf813da10.png",
    ],
    isArray: true,
  })
  files: string[];
}

export class FileInfoDto {
  @ApiProperty({
    description: "Nombre del archivo",
    example: "file_1_635d839a-15c3-4ebe-8343-154f2c404c0b.pdf",
  })
  filename: string;

  @ApiProperty({
    description: "Tamaño del archivo en bytes",
    example: 61687,
  })
  size: number;

  @ApiProperty({
    description: "Tipo MIME del archivo",
    example: "pdf/pdf",
  })
  type: string;
}

export class FilesListResponseDto {
  @ApiProperty({
    description: "Número total de archivos encontrados",
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: "Listado de archivos",
    type: FileInfoDto,
    isArray: true,
  })
  files: FileInfoDto[];
}

// export class DeleteFilesResponseDto {
//   @ApiProperty({
//     description: "Mensaje de operación",
//     example: "3 files deleted successfully",
//   })
//   message: string;

//   @ApiProperty({
//     description: "Número de archivos eliminados",
//     example: 3,
//   })
//   deletedCount: number;

//   @ApiProperty({
//     description: "Prefijo usado para la eliminación",
//     example: "user_uploads_123/",
//   })
//   keyPrefix: string;
// }
