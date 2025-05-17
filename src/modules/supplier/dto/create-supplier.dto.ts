import { ApiProperty } from "@nestjs/swagger";
import { proveedores } from "@prisma/client";

export type CreateSupplierDto = Omit<proveedores, ""> & {};

export class SwaggerSupplierDto {
  @ApiProperty() provcod: string;
  @ApiProperty() provnom: string ;
}

export class SwaggerCreateSupplierResponse {
  @ApiProperty() provcod: string;
  @ApiProperty() provnom: string ;

}

export class SwaggerUpdateSupplierDto {
  @ApiProperty() provcod?: string;
  @ApiProperty() provnom?: string ;

}

export class SupplierFetchResponseDto {
  @ApiProperty({
    // example: '',
    description: 'Número de celular del proveedor',
    required: false
  })
  Celular: string;

  @ApiProperty({
    // example: 'P2006',
    description: 'Código único del proveedor',
    required: true
  })
  Codigo: string;

  @ApiProperty({
    // example: '',
    description: 'Código postal del proveedor',
    required: false
  })
  CodigoPostal: string;

  @ApiProperty({
    // example: 'S',
    description: 'Indica si el contacto está activo (S/N)',
    enum: ['S', 'N']
  })
  ContactoActivo: string;

  @ApiProperty({
    // example: 'MO',
    description: 'Código del departamento',
    required: true
  })
  DepartamentoCodigo: string;

  @ApiProperty({
    // example: 'Montevideo',
    description: 'Nombre del departamento',
    required: true
  })
  DepartamentoNombre: string;

  @ApiProperty({
    // example: '.',
    description: 'Dirección principal del proveedor',
    required: false
  })
  Direccion: string;

  @ApiProperty({
    // example: '., MONTEVIDEO, Montevideo, Uruguay',
    description: 'Dirección completa formateada',
    required: false
  })
  DireccionCompleta: string;

  @ApiProperty({
    // example: '.',
    description: 'Número de documento',
    required: false
  })
  Documento: string;

  @ApiProperty({
    // example: '',
    description: 'Sigla del documento',
    required: false
  })
  DocumentoSigla: string;

  @ApiProperty({
    // example: '',
    description: 'Tipo de documento',
    required: false
  })
  DocumentoTipo: string;

  @ApiProperty({
    // example: '',
    description: 'Email principal de contacto',
    required: false
  })
  Email1: string;

  @ApiProperty({
    // example: '',
    description: 'Email secundario de contacto',
    required: false
  })
  Email2: string;

  @ApiProperty({
    // example: 'N',
    description: 'Indica si es cliente (S/N)',
    enum: ['S', 'N']
  })
  EsCliente: string;

  @ApiProperty({
    // example: 'S',
    description: 'Indica si es proveedor (S/N)',
    enum: ['S', 'N']
  })
  EsProveedor: string;

  @ApiProperty({
    // example: '2022-10-06',
    description: 'Fecha de alta del proveedor',
    format: 'date'
  })
  FechaAlta: string;

  @ApiProperty({
    // example: '',
    description: 'Código del giro comercial',
    required: false
  })
  GiroCodigo: string;

  @ApiProperty({
    // example: '',
    description: 'Nombre del giro comercial',
    required: false
  })
  GiroNombre: string;

  @ApiProperty({
    // example: '',
    description: 'Código del grupo al que pertenece',
    required: false
  })
  GrupoCodigo: string;

  @ApiProperty({
    // example: '',
    description: 'Nombre del grupo al que pertenece',
    required: false
  })
  GrupoNombre: string;

  @ApiProperty({
    // example: 'MONTEVIDEO',
    description: 'Localidad del proveedor',
    required: true
  })
  Localidad: string;

  @ApiProperty({
    // example: '5M TRAVEL',
    description: 'Nombre comercial del proveedor',
    required: true
  })
  Nombre: string;

  @ApiProperty({
    // example: '',
    description: 'Notas adicionales sobre el proveedor',
    required: false
  })
  Notas: string;

  @ApiProperty({
    // example: '',
    description: 'Código del origen del proveedor',
    required: false
  })
  OrigenCodigo: string;

  @ApiProperty({
    // example: '',
    description: 'Nombre del origen del proveedor',
    required: false
  })
  OrigenNombre: string;

  @ApiProperty({
    // example: 'UY',
    description: 'Código del país',
    required: true
  })
  PaisCodigo: string;

  @ApiProperty({
    // example: 'Uruguay',
    description: 'Nombre del país',
    required: true
  })
  PaisNombre: string;

  @ApiProperty({
    // example: 0,
    description: 'Código del propietario',
    required: false
  })
  PropietarioCodigo: number;

  @ApiProperty({
    // example: '',
    description: 'Nombre del propietario',
    required: false
  })
  PropietarioNombre: string;

  @ApiProperty({
    // example: '',
    description: 'RUT del proveedor',
    required: false
  })
  RUT: string;

  @ApiProperty({
    // example: '5M TRAVEL',
    description: 'Razón social del proveedor',
    required: true
  })
  RazonSocial: string;

  @ApiProperty({
    // example: '.',
    description: 'Teléfono principal de contacto',
    required: false
  })
  Telefono: string;

  @ApiProperty({
    // example: '',
    description: 'Sitio web del proveedor',
    required: false
  })
  Web: string;

  @ApiProperty({
    // example: '',
    description: 'Código de la zona',
    required: false
  })
  ZonaCodigo: string;

  @ApiProperty({
    // example: '',
    description: 'Nombre de la zona',
    required: false
  })
  ZonaNombre: string;
}