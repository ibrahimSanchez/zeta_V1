import { CreateClientDto } from "./create-client.dto";

export type UpdateClientDto = Partial<Omit<CreateClientDto, "clicod">>;
