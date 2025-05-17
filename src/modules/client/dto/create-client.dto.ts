import { ApiProperty } from "@nestjs/swagger";
import { clientes } from "@prisma/client";

export type CreateClientDto = Omit<clientes, ""> & {};

export class SwaggerClientDto {
  @ApiProperty() clicod: string;
  @ApiProperty() clicodbit: string;
  @ApiProperty() clinom: string;
  @ApiProperty() cliruc: string;
  @ApiProperty() clirazsoc: string;
  @ApiProperty() clidir: string;
  @ApiProperty() cliest: boolean;
}

export class SwaggerClientCodesNamesResponseDto {
  @ApiProperty() clicod: string;
  @ApiProperty() clicodbit: string;
}

export class SwaggerUpdateClientDto {
  @ApiProperty() clicodbit?: string;
  @ApiProperty() clinom?: string;
  @ApiProperty() cliruc?: string;
  @ApiProperty() clirazsoc?: string;
  @ApiProperty() clidir?: string;
  @ApiProperty() cliest?: boolean;
}

export class ClientFetchResponseDto {
  @ApiProperty({
    // example: 'A.N.T.E.L (PROV. N 49771)',
    description: "Nombre comercial del cliente/proveedor",
    required: true,
  })
  name: string;

  @ApiProperty({
    // example: '211003420017',
    description: "RUC (Registro Único de Contribuyente)",
    required: true,
  })
  ruc: string;

  @ApiProperty({
    // example: 'A.N.T.E.L (PROV. N 49771)',
    description: "Razón social o nombre legal",
    required: true,
  })
  companyName: string;

  @ApiProperty({
    // example: 'D.FERNANDEZ CRESPO 1534, MONTEVIDEO, Montevideo, Uruguay',
    description: "Dirección completa",
    required: true,
  })
  address: string;

  @ApiProperty({
    // example: '218',
    description: "Código único identificador",
    required: true,
  })
  code: string;
}
