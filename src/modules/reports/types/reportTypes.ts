export interface ClientReportQuery {
  clicod: string;
  startDate: Date;
  endDate: Date;
}

export interface SupplierReportQuery {
  provcod: string;
  startDate: Date;
  endDate: Date;
}

export interface BrandReportQuery {
  ordmar: string;
}

export interface DatesReportQuery {
  startDate: Date;
  endDate: Date;
}


//   {
//     "clicod": "10145",
//      "startDate": "2008-04-02T17:05:41.000Z",
//      "endDate": "2008-04-05T17:05:41.000Z"
//   }

export interface ClientReportResponse {}

export interface SupplierReportResponse {}
