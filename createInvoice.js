const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({
    size: "LETTER", margins: {
      top: 10,
      bottom: 5,
      left: 32,
      right: 32
    }
  });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("ACME Inc.", 110, 57)
    .fontSize(10)
    .text("ACME Inc.", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

function emisorResecptor(doc, emisor, receptor) {
  // Write the emisor information
  doc.text('Emisor', 0, 50);
  doc.text('FARMACIAS BENAVIDES S.A.B. DE C.V.', 50, 50);
  doc.text('FBE9110215Z3', 50, 65);
  doc.text('Regimen Fiscal: 601', 50, 80);
  doc.text('Lugar de expedición: 89800', 50, 95);

  // Write the receptor information below the emisor with 20px distance
  doc.text('Receptor', 0, 115);
  doc.text('LEYADCO FUNCION VIABLE SA DE CV', 50, 115);
  doc.text('LFV210222C26', 50, 130);
  doc.text('Regimen Fiscal: undefined', 50, 145);
  doc.text('Código Postal: undefined', 50, 160);
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc.fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
      ", " +
      invoice.shipping.state +
      ", " +
      invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 300;

  doc.font("Helvetica-Bold", size = 7);

  generateTableRow(
    doc,
    invoiceTableTop,
    'Clave Prod./Serv.', 'Concepto', 'Clave Unidad', 'Cantidad', 'Precio Unitario', 'Descuento', 'Importe'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, position, item.claveProdServ, item.concepto, item.claveUnidad,
      item.cantidad, formatCurrency(item.precioUnitario), item.descuento, formatCurrency(item.importe));
    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, subtotalPosition, '', '', '', '', '', 'Subtotal ', formatCurrency(invoice.subtotal));

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(doc, paidToDatePosition, "", "", "Paid To Date", "", formatCurrency(invoice.paid));

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, duePosition, "", "", "Balance Due", "", formatCurrency(invoice.subtotal - invoice.paid));
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      750,
      { align: "center", width: 500 }
    );
}

function generateTableRow(doc, y, claveProdServ, concepto, claveUnidad, cantidad, precioUnitario, descuento, importe) {
  doc
    .fontSize(7)
    .text(claveProdServ, 50, y)
    .text(concepto, 150, y)
    .text(claveUnidad, 280, y, { width: 90, align: "right" })
    .text(cantidad, 370, y, { width: 90, align: "right" })
    .text(cantidad, 390, y, { width: 90, align: "right" })
    .text(importe, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};


//***** */

const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream('output.pdf'));

// Add the logo
doc.image('logo.png', 100, 100, { width: 100 });

// Add the header information
doc.fontSize(12).text('Factura - Ingreso', 200, 100);
doc.text('Folio: 1573', 200, 120);
doc.text('Fecha de emisión: 2023-02-19T21:03:24', 200, 130);
doc.text('Fecha de certificación: 2023-02-19T21:03:26', 200, 140);
doc.text('Folio fiscal: 85680386-b82c-4104-82b5-ace61683b191', 200, 150);
doc.text('No. Certificado Digital: 00001000000503146001', 200, 160);
doc.text('No. Certificado SAT: 00001000000505563741', 200, 170);

// Add the emisor and receptor information
doc.text('Emisor', 100, 200);
doc.text('COPAÑOA BUENAVISTA S.A.B. DE C.V.', 100, 210);
doc.text('CON7110215Z3', 100, 220);
doc.text('Regimen Fiscal: 601', 100, 230);
doc.text('Lugar de expedición: 89800', 100, 240);

doc.text('Receptor', 300, 200);
doc.text('ESTADO FUNCION VIAJE SA DE CV', 300, 210);
doc.text('EFV220522C26', 300, 220);
doc.text('Regimen Fiscal: undefined', 300, 230);
doc.text('Código Postal: undefined', 300, 240);

// Add the datos del CFDI information
doc.text('Datos del CFDI', 100, 300);
doc.text('Uso del CFDI: G03', 100, 310);
doc.text('Método de pago: PUE', 100, 320);
doc.text('Forma de pago: 01', 100, 330);
doc.text('Exportacion: undefined', 100, 340);
doc.text('Moneda: MXN', 100, 350);
doc.text('Tipo de cambio: 1', 100, 360);

// Add the body of the table
doc.table([
 items= ['Clave Prod./Serv.', 'Concepto', 'Clave Unidad', 'Cantidad', 'Precio Unitario', 'Descuento', 'Importe'],
  ['50161815', 'ADAMS TRIDENT MENTA 4', 'H87', '2.00', '$2.59', '$0.00', '$5.18'],
  ['50161815', 'ADAMS TRIDENT MENTA 4', 'H87', '4.00', '$2.59', '$0.00', '$10.36'],
  ['51101557', 'ALMUS DOXICICLINA 100 MG 28 CAP', 'H87', '1.00', '$214.70', '$0.00', '$214.70']}
  ['85141601', 'AR
