import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
import { SupplierService } from '../supplier/supplier.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class FetchDataService {
  private readonly logger = new Logger(FetchDataService.name);

  constructor(
    private readonly clientService: ClientService,
    private readonly supplierService: SupplierService,
    private readonly productService: ProductService,
  ) {}

  async loadData() {
    const results = await Promise.allSettled([
      this.clientService.fetchClients(),
      this.supplierService.fetchSuppliers(),
      this.productService.fetchArticles(),
    ]);

    const response = {
      clients: this.formatResult(results[0], 'Clients'),
      suppliers: this.formatResult(results[1], 'Suppliers'),
      products: this.formatResult(results[2], 'Products'),
    };

    return {
      message: 'Data loading completed',
      results: response,
    };
  }

  private formatResult(result: PromiseSettledResult<any>, label: string) {
    if (result.status === 'fulfilled') {
      this.logger.log(`${label} loaded successfully.`);
      return { success: true };
    } else {
      this.logger.error(`${label} loading failed:`, result.reason);
      return { success: false, error: result.reason?.message || 'Unknown error' };
    }
  }
}
