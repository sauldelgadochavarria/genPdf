const { createInvoice } = require("./createInvoice.js");
const { createCFDI4Invoice } = require("./tstPdf.js");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};

const invoice2 = {
  "_id": "5951AB7A-CB73-4F7B-8416-4519A77BA780",
  "Comprobante": {
    "xmlnscfdi": "http://www.sat.gob.mx/cfd/3",
    "Certificado": "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",
    "CondicionesDePago": "CONTADO",
    "Fecha": "2022-09-16T14:38:15.000Z",
    "Folio": "43293",
    "FormaPago": "99",
    "LugarExpedicion": "66376",
    "MetodoPago": "PPD",
    "Moneda": "MXN",
    "NoCertificado": "00001000000505648074",
    "Sello": "l3Vju48U5+I02FlcnijyVsECwqfsWpl6hyTmWUJs9M0eqNvsbj9lkDm6wzaGIN2jrCfteRCC5rz88Egu8Imzxz4IYkcGgrop2X03AOOg4EgQbJRhGbUjmge0zHCPCafNbu8DbLenTEViy3jw/EXqoZkYAZPiumjusYQyimzR2S4U1zK3yd2lXrCSsix4KYQU/541aPE1tD2nk6wX6boP+JPYVmtNM/xv/bgnO7YCoy8lXldsKUTEcvKicraT66j9lpsF/xuNxRvUdzndSgLx6mqRkS8XHIyUagsPH1fWKmVLnipUpi5I6Mq56rrCAmjHpdhTaCTY0vlVi7zbDEzwwg==",
    "Serie": "A",
    "SubTotal": 43400,
    "TipoDeComprobante": "I",
    "Total": 50344,
    "Version": "3.3",
    "xsischemaLocation": "http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd",
    "Emisor": {
      "Rfc": "AFR870724GU1",
      "Nombre": "ACEROS FERCOM SA DE CV",
      "RegimenFiscal": "601"
    },
    "Receptor": {
      "Rfc": "RIM050601BD1",
      "Nombre": "RECONSTRUCTORA INDUSTRIAL MANUFACTURERA MONTERREY S.A. C.V."
    },
    "Archivo": "5951AB7A-CB73-4F7B-8416-4519A77BA780@1000000000XX0.xml",
    "Estatus": "vigente",
    "Conceptos": [
      {
        "Concepto": [
          {
            "Cantidad": "1.0000",
            "ClaveProdServ": "30102204",
            "ClaveUnidad": "H87",
            "Descripcion": "PLACA A-516 GRADO 70 DE 3/8\" PZA\n01 PZ: 3/8\" x 48\" x 120\"\r\nASME-SA-516-70",
            "Importe": "14400.00",
            "NoIdentificacion": "A516-70 3/8 PZA",
            "Unidad": "PZA",
            "ValorUnitario": "14400.0000",
            "cfdiImpuestos": {
              "cfdiTraslados": {
                "cfdiTraslado": {
                  "Base": "14400.00",
                  "Importe": "2304.00",
                  "Impuesto": "002",
                  "TasaOCuota": "0.160000",
                  "TipoFactor": "Tasa"
                }
              }
            },
            "cfdi:Parte": {
              "Cantidad": "281.0000",
              "ClaveProdServ": "30102204",
              "Descripcion": "PLACA A-516 GRADO 70 DE 3/8\"",
              "NoIdentificacion": "NA516-70 3/8"
            }
          },
          {
            "Cantidad": "1.0000",
            "ClaveProdServ": "30102204",
            "ClaveUnidad": "H87",
            "Descripcion": "PLACA A-516 GRADO 70 DE 3/4\" PZA\n01 PZ: 3/4\" x 48\" x 120\"\r\nASME-SA-516-70.",
            "Importe": "29000.00",
            "NoIdentificacion": "A516-70 3/4 PZA",
            "Unidad": "PZA",
            "ValorUnitario": "29000.0000",
            "cfdiImpuestos": {
              "cfdiTraslados": {
                "cfdiTraslado": {
                  "Base": "29000.00",
                  "Importe": "4640.00",
                  "Impuesto": "002",
                  "TasaOCuota": "0.160000",
                  "TipoFactor": "Tasa"
                }
              }
            },
            "cfdi:Parte": {
              "Cantidad": "562.0000",
              "ClaveProdServ": "30102204",
              "Descripcion": "PLACA A-516 GRADO 70 DE 3/4\"",
              "NoIdentificacion": "NA516-70 3/4",
              "Unidad": "KG"
            }
          }
        ]
      }
    ],
    "cfdiImpuestos": {
      "TotalImpuestosTrasladados": 6944,
      "cfdiTraslados": {
        "cfdiTraslado": {
          "Importe": 6944,
          "Impuesto": "002",
          "TasaOCuota": "0.160000",
          "TipoFactor": "Tasa"
        }
      }
    },
    "Complemento": {
      "TimbreFiscalDigital": {
        "xsischemaLocation": "http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd",
        "UUID": "5951AB7A-CB73-4F7B-8416-4519A77BA780",
        "FechaTimbrado": {
          "$date": "2022-09-16T14:38:20.000Z"
        },
        "selloCFD": "l3Vju48U5+I02FlcnijyVsECwqfsWpl6hyTmWUJs9M0eqNvsbj9lkDm6wzaGIN2jrCfteRCC5rz88Egu8Imzxz4IYkcGgrop2X03AOOg4EgQbJRhGbUjmge0zHCPCafNbu8DbLenTEViy3jw/EXqoZkYAZPiumjusYQyimzR2S4U1zK3yd2lXrCSsix4KYQU/541aPE1tD2nk6wX6boP+JPYVmtNM/xv/bgnO7YCoy8lXldsKUTEcvKicraT66j9lpsF/xuNxRvUdzndSgLx6mqRkS8XHIyUagsPH1fWKmVLnipUpi5I6Mq56rrCAmjHpdhTaCTY0vlVi7zbDEzwwg==",
        "noCertificadoSAT": "00001000000505142236",
        "selloSAT": "c8QicWLKA4TdDAZiTVMuVzoYyojLyKz3i5wz1rXNxMH6rXnhLZbJzxXj9RFaMX7r66JKUAedbHZ173WuZOoPIXVPrx96n51fxem7LuGHHNStS62MDlGNYSeMtcS567KWoOEyhxrPT7YqyU01vki/S+C8wfoqTMTbiKjshS46IECY73T08Dw4B0kpW6LHP6Y686c9Mkv0Hdxru+zqvzuM5utWEFyFDPY8OLEhNFwB1JimnYKpJdsBSQ0xbzg00vNEPMwwhxCaz3gzhZFAmiL5nPEjg30mQyoThcxE4IK31KuPNGYj0musuUuofOews45wvRURV+cXZkTn5/eS6/E60g==",
        "xmlnstfd": "http://www.sat.gob.mx/TimbreFiscalDigital",
        "xmlnsxsi": "http://www.w3.org/2001/XMLSchema-instance"
      },
      "nomina12Nomina": {
        "nomina12Percepciones": {
          "nomina12Percepcion": []
        },
        "nomina12Deducciones": {
          "nomina12Deduccion": []
        }
      },
      "cartaporte20CartaPorte": {
        "cartaporte20Ubicaciones": {
          "cartaporte20Ubicacion": []
        },
        "cartaporte20Mercancias": {
          "cartaporte20Autotransporte": {
            "cartaporte20Remolques": {
              "cartaporte20Remolque": []
            }
          }
        }
      }
    }
  },
  "__v": 0
}

createCFDI4Invoice(invoice2, "invoiceSat.pdf");
createInvoice(invoice, "invoice.pdf");
