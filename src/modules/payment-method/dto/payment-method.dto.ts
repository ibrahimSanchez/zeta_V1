import { ApiProperty } from '@nestjs/swagger';

export class SwaggerPaymentMethodDto {
  @ApiProperty({ description: 'Código del método de pago' })
  pagocod: number;

  @ApiProperty({ description: 'Nombre del método de pago' })
  pagonom: string;
}

export class SwaggerPaymentMethodsResponse {
  @ApiProperty({ 
    type: [SwaggerPaymentMethodDto],
    description: 'Lista de métodos de pago' 
  })
  data: SwaggerPaymentMethodDto[];
}

export class SwaggerSinglePaymentMethodResponse {
  @ApiProperty({ 
    type: SwaggerPaymentMethodDto,
    description: 'Detalles del método de pago' 
  })
  data: SwaggerPaymentMethodDto;
}