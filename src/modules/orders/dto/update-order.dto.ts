import { CreateOrderDto } from './create-order.dto';

export type UpdateOrderDto = Partial<Omit<CreateOrderDto, "ordcod">>;
