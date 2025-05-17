import { ApiProperty } from '@nestjs/swagger';

export class SwaggerOrderStateDto {
  @ApiProperty({ description: 'Código del estado de orden' })
  estcod: number;

  @ApiProperty({ description: 'Nombre del estado de orden' })
  estnom: string;
}

export class SwaggerOrderStatesResponse {
  @ApiProperty({ 
    type: [SwaggerOrderStateDto],
    description: 'Lista de estados de orden' 
  })
  data: SwaggerOrderStateDto[];
}

export class SwaggerSingleOrderStateResponse {
  @ApiProperty({ 
    type: SwaggerOrderStateDto,
    description: 'Detalles del estado de orden' 
  })
  data: SwaggerOrderStateDto;
}