-- CreateTable
CREATE TABLE "clien" (
    "cliente" INTEGER NOT NULL,
    "vend" INTEGER,
    "nombre_cliente" VARCHAR(30),
    "direccion" VARCHAR(30),
    "c_postal" INTEGER,
    "localidad" VARCHAR(15),
    "depto" INTEGER,
    "telefono" VARCHAR(15),
    "ruc" VARCHAR(15),
    "envio" INTEGER,
    "f_pago" INTEGER,
    "lista" VARCHAR(2),
    "des_fact" INTEGER,
    "desc_rec" INTEGER,
    "tope_cred" INTEGER,
    "cred_usado" INTEGER,
    "siglo_ult_vta" INTEGER,
    "f_ult_vta" INTEGER,
    "observaciones" VARCHAR(40),
    "param1" INTEGER,
    "param2" INTEGER,
    "res_1" INTEGER,
    "res_2" VARCHAR(1),
    "res_3" VARCHAR(30),
    "res_4" VARCHAR(50),

    CONSTRAINT "clien_pkey" PRIMARY KEY ("cliente")
);

-- CreateTable
CREATE TABLE "clientes" (
    "clicod" VARCHAR(50) NOT NULL,
    "clicodbit" INTEGER,
    "clinom" VARCHAR(127),
    "cliruc" VARCHAR(50),
    "clirazsoc" VARCHAR(127),
    "clidir" VARCHAR(255),
    "cliest" BOOLEAN NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("clicod")
);

-- CreateTable
CREATE TABLE "configuraciones" (
    "fldname" VARCHAR(50) NOT NULL,
    "lnglbl" VARCHAR(50),
    "shtlbl" VARCHAR(50),
    "fldtype" INTEGER,
    "tbase" VARCHAR(50),
    "fbase" VARCHAR(50),
    "boundcolumn" INTEGER,
    "columncount" INTEGER,
    "columnwidths" VARCHAR(50),
    "orderby" VARCHAR(255),
    "sql" TEXT,

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("fldname")
);

-- CreateTable
CREATE TABLE "estados" (
    "estcod" INTEGER NOT NULL,
    "estnom" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("estcod")
);

-- CreateTable
CREATE TABLE "formatoinformes" (
    "nombre" VARCHAR(50) NOT NULL,
    "id_informe" INTEGER,
    "predeterminado" BOOLEAN NOT NULL,
    "recordsource" VARCHAR(50),
    "titulo" VARCHAR(100),
    "contador" VARCHAR(50),
    "agrupar1" BOOLEAN NOT NULL,
    "agrupar2" BOOLEAN NOT NULL,
    "orden1" VARCHAR(50),
    "orden2" VARCHAR(50),
    "btnorden1" BOOLEAN NOT NULL,
    "btnorden2" BOOLEAN NOT NULL,
    "listacampos" TEXT,

    CONSTRAINT "formatoinformes_pkey" PRIMARY KEY ("nombre")
);

-- CreateTable
CREATE TABLE "id3728365jpdc" (
    "id" VARCHAR(50) NOT NULL,

    CONSTRAINT "id3728365jpdc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monedas" (
    "moncod" INTEGER NOT NULL,
    "monnom" VARCHAR(50),
    "monabr" VARCHAR(3),

    CONSTRAINT "monedas_pkey" PRIMARY KEY ("moncod")
);

-- CreateTable
CREATE TABLE "ordenes" (
    "ordcod" INTEGER NOT NULL,
    "vendcod" INTEGER NOT NULL,
    "clicod" INTEGER,
    "clidir" VARCHAR(255) NOT NULL,
    "ordfec" TIMESTAMP(3) NOT NULL,
    "ordfecpro" TIMESTAMP(3) NOT NULL,
    "ordmar" VARCHAR(63),
    "ordequ" VARCHAR(63),
    "ordnumtal" VARCHAR(50),
    "ordmat" VARCHAR(50),
    "ordarmpor" INTEGER,
    "ordins" BOOLEAN NOT NULL,
    "ordent" BOOLEAN NOT NULL,
    "ordace" BOOLEAN NOT NULL,
    "estcod" INTEGER NOT NULL,
    "ordvia" INTEGER,
    "ordnumfac" INTEGER,
    "ordnumrem" INTEGER,
    "ordretcli" BOOLEAN NOT NULL,
    "ordretdec" BOOLEAN NOT NULL,
    "ordentven" BOOLEAN NOT NULL,
    "ordobs" TEXT,
    "ordcos" DOUBLE PRECISION,
    "ordmon" DOUBLE PRECISION,
    "moncod" INTEGER,
    "pagocod" INTEGER,
    "ordcom" DOUBLE PRECISION,
    "ordrev" BOOLEAN NOT NULL,
    "ordinstec" BOOLEAN NOT NULL,

    CONSTRAINT "ordenes_pkey" PRIMARY KEY ("ordcod")
);

-- CreateTable
CREATE TABLE "msyscompacterror" (
    "errorcode" INTEGER NOT NULL,
    "errordescription" TEXT,
    "errortable" VARCHAR(255),
    "errorrecid" BYTEA,

    CONSTRAINT "msyscompacterror_pkey" PRIMARY KEY ("errorcode")
);

-- CreateTable
CREATE TABLE "pagos" (
    "pagocod" INTEGER NOT NULL,
    "pagonom" VARCHAR(50),
    "pagocom" DOUBLE PRECISION,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("pagocod")
);

-- CreateTable
CREATE TABLE "prefijos" (
    "precod" INTEGER NOT NULL,
    "predes" VARCHAR(100),

    CONSTRAINT "prefijos_pkey" PRIMARY KEY ("precod")
);

-- CreateTable
CREATE TABLE "productos" (
    "prodcod" VARCHAR(50) NOT NULL,
    "prodnom" VARCHAR(50) NOT NULL,
    "tipprodcod" INTEGER,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("prodcod")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "provcod" VARCHAR(50) NOT NULL,
    "provnom" VARCHAR(50),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("provcod")
);

-- CreateTable
CREATE TABLE "stock" (
    "articulo" VARCHAR(10) NOT NULL,
    "grupo" INTEGER,
    "tipo" INTEGER,
    "nombre_articulo" VARCHAR(50),
    "articulo_edit" VARCHAR(12),
    "prov" INTEGER,
    "param1" VARCHAR(1),
    "param2" VARCHAR(1),
    "precio1" INTEGER,
    "precio2" INTEGER,
    "precio3" INTEGER,
    "neto1" VARCHAR(1),
    "neto2" VARCHAR(1),
    "neto3" VARCHAR(1),
    "iva" INTEGER,
    "compmes_u" INTEGER,
    "compmes_v" INTEGER,
    "ventmes_u" INTEGER,
    "ventmes_v" INTEGER,
    "compacu_u" INTEGER,
    "compacu_v" INTEGER,
    "ventacu_u" INTEGER,
    "ventacu_v" INTEGER,
    "siglo_ult_vta" INTEGER,
    "f_ult_vta" INTEGER,
    "siglo_ult_com" INTEGER,
    "f_ult_com" INTEGER,
    "costo_prom" INTEGER,
    "costo_repos" INTEGER,
    "siglo_repos" INTEGER,
    "f_repos" INTEGER,
    "res_1" INTEGER,
    "siglo_uc1" INTEGER,
    "fecha_uc1" INTEGER,
    "cant_uc1" INTEGER,
    "costo_uc1" INTEGER,
    "dto_uc1" INTEGER,
    "prov_uc1" INTEGER,
    "siglo_uc2" INTEGER,
    "fecha_uc2" INTEGER,
    "cant_uc2" INTEGER,
    "costo_uc2" INTEGER,
    "dto_uc2" INTEGER,
    "prov_uc2" INTEGER,
    "siglo_uc3" INTEGER,
    "fecha_uc3" INTEGER,
    "cant_uc3" INTEGER,
    "costo_uc3" INTEGER,
    "dto_uc3" INTEGER,
    "prov_uc3" INTEGER,
    "siglo_uc4" INTEGER,
    "fecha_uc4" INTEGER,
    "cant_uc4" INTEGER,
    "costo_uc4" INTEGER,
    "dto_uc4" INTEGER,
    "prov_uc4" INTEGER,
    "siglo_uv1" INTEGER,
    "fecha_uv1" INTEGER,
    "cant_uv1" INTEGER,
    "precio_uv1" INTEGER,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("articulo")
);

-- CreateTable
CREATE TABLE "tipoproductos" (
    "tipprodcod" INTEGER NOT NULL,
    "tipprodgru" INTEGER,
    "tipprodnom" VARCHAR(50),
    "tipprodimp" BOOLEAN NOT NULL,

    CONSTRAINT "tipoproductos_pkey" PRIMARY KEY ("tipprodcod")
);

-- CreateTable
CREATE TABLE "tipousuarios" (
    "tipusucod" INTEGER NOT NULL,
    "tipusunom" VARCHAR(50),

    CONSTRAINT "tipousuarios_pkey" PRIMARY KEY ("tipusucod")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "usucod" INTEGER NOT NULL,
    "usunom" VARCHAR(50) NOT NULL,
    "usucla" VARCHAR(50) NOT NULL,
    "tipusucod" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usucod")
);

-- CreateTable
CREATE TABLE "vendedores" (
    "vendcod" INTEGER NOT NULL,
    "vendnom" VARCHAR(50),
    "vendmai" VARCHAR(100),
    "usucod" INTEGER,

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("vendcod")
);

-- CreateTable
CREATE TABLE "historialestados" (
    "hiscod" INTEGER NOT NULL,
    "ordcod" INTEGER,
    "estcod" INTEGER,
    "usucod" INTEGER NOT NULL,
    "hisfec" TIMESTAMP(3),

    CONSTRAINT "historialestados_pkey" PRIMARY KEY ("hiscod")
);

-- CreateTable
CREATE TABLE "ordenesproductos" (
    "ordprodcod" INTEGER NOT NULL,
    "ordcod" INTEGER NOT NULL,
    "prodcod" INTEGER NOT NULL,
    "ordprodcon" VARCHAR(255),
    "ordprodcan" INTEGER,
    "provcod" INTEGER NOT NULL,
    "ordprodlle" BOOLEAN NOT NULL,
    "ordprodnumfac" INTEGER,
    "ordprodpre" DOUBLE PRECISION,
    "ordprodprereal" DOUBLE PRECISION,

    CONSTRAINT "ordenesproductos_pkey" PRIMARY KEY ("ordprodcod")
);

-- CreateTable
CREATE TABLE "tipos" (
    "tipo" INTEGER NOT NULL,
    "grupo" INTEGER NOT NULL,
    "nombre_tipo" VARCHAR(50),

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("tipo","grupo")
);
