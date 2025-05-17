import { ApiProperty } from '@nestjs/swagger';

export class SwaggerCurrencyDto {
  @ApiProperty({ description: 'Código de la moneda' })
  moncod: number;

  @ApiProperty({ description: 'Nombre de la moneda' })
  monnom: string;
}

export class SwaggerCurrencyResponse {
  @ApiProperty({ 
    type: [SwaggerCurrencyDto],
    description: 'Lista de monedas' 
  })
  data: SwaggerCurrencyDto[];
}

export class SwaggerSingleCurrencyResponse {
  @ApiProperty({ 
    type: SwaggerCurrencyDto,
    description: 'Detalles de la moneda' 
  })
  data: SwaggerCurrencyDto;
}