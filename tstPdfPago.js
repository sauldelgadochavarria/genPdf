const PDFDocument = require('pdfkit');
const fs = require('fs');
const parseString = require('xml2js').parseString;
const base64Img = require('base64-img');

function createCFDI4Payment(xmlObj, path, qrStr) {
    var margenD = 20;
    var margenI = 20;
    var margenUp = 20;
    var margenDw = 20;
    var nl = 10 // newline;
    const puntosPorPulgada = 72;
    const anchoPagina = 8.5 * puntosPorPulgada;

    let doc = new PDFDocument({
        size: "LETTER", margins: {
            top: margenUp,
            bottom: margenDw,
            left: margenI,
            right: margenD
        }
    });
    // const Concepto = xmlObj['cfdi:Conceptos']['cfdi:Concepto']
    // console.log('Concepto' + JSON.stringify(Concepto));
    generateHeader(doc, margenI, margenD, margenUp, margenDw, nl, puntosPorPulgada, anchoPagina, xmlObj);
    // generateHeaderPaid(doc, margenI, margenD, margenUp, margenDw, nl, puntosPorPulgada, anchoPagina, xmlObj);
    // generateCustomerInformation(doc, invoice);
    // generateInvoiceTable(doc, margenI, margenD, margenUp, margenDw, nl, anchoPagina, Concepto);
    // TODO
    // generateFooter(doc, margenI, margenD, margenUp, margenDw, nl, anchoPagina, xmlObj, qrStr);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}




// Create a new PDF document
// const doc = new PDFDocument();
function generateHeader(doc, margenI, margenD, margenUp, margenDw, nl, puntosPorPulgada, anchoPagina, xmlObj) {
    // obtiene valores del xml de cfdi
    const { Version, Folio, Fecha, Sello, FormaPago, NoCertificado, Certificado, SubTotal, Descuento = "0.00", Moneda, TipoCambio, Total, TipoDeComprobante, Exportacion, MetodoPago, LugarExpedicion } = xmlObj
    const { Rfc, Nombre, RegimenFiscal } = xmlObj['cfdi:Emisor']
    const { Rfc: rRfc, Nombre: rNombre, DomicilioFiscalReceptor, RegimenFiscalReceptor, UsoCFDI } = xmlObj['cfdi:Receptor']
    const { NoCertificadoSAT, FechaTimbrado, UUID } = xmlObj['cfdi:Complemento']

    console.log('Versión' + Version);
    var pv = margenUp;


    const lightGray = [211, 211, 211];

    // Set the font and font size
    doc.font('Helvetica').fontSize(7);

    // Add the header
    //calcularPosicionColumna(margenIzquierdo, margenDerecho, numeroColumnas, columnaActual)
    // llena rengol de gris

    var h1col2 = calcularPosicionColumna(margenI, margenD, 5, 2);
    var h1col4 = calcularPosicionColumna(margenI, margenD, 5, 4);
    pv += 30
    var h1col2rect = calcularPosicionColumna(margenI, margenD, 1, 1);
    /*
    llena fondo con un rectangulo
    doc.rect(x, y, width, height);
    x: La coordenada x de la esquina superior izquierda del rectángulo.
    y: La coordenada y de la esquina superior izquierda del rectángulo.
    width: El ancho del rectángulo.
    height: La altura del rectángulo.
    */
    anchoRenglon = anchoPagina - (margenI + margenD + (h1col2 - calcularPosicionColumna(margenI, margenD, 5, 1)))
    // doc.rect(h1col2 - nl, pv, anchoPagina - (margenI + margenD), nl - 2).fillColor(lightGray).fill();
    doc.rect(h1col2, pv - 2, anchoRenglon, nl - 2).fillColor(lightGray).fill();
    doc.fillColor('black');
    doc.text('Factura - Ingreso        versión ' + Version, h1col2, pv);
    pv += nl;
    doc.text('Folio: ' + Folio, h1col2, pv);
    doc.text('Folio fiscal:' + UUID, h1col4, pv);
    pv += nl;
    doc.text('Fecha de emisión:' + Fecha, h1col2, pv);
    doc.text('No. Certificado Digital:' + NoCertificado, h1col4, pv);
    pv += nl;
    doc.text('Fecha de timbrado:' + FechaTimbrado, h1col2, pv);
    doc.text('No. Certificado SAT:' + NoCertificadoSAT, h1col4, pv);
    pv += nl;
    pv += nl;
    // agrga rectangulo gris
    var h2col1 = calcularPosicionColumna(margenI, margenD, 2, 1);
    var h1col2 = calcularPosicionColumna(margenI, margenD, 2, 2);
    doc.rect(h2col1, pv - 2, anchoPagina - (margenI + margenD), nl - 2).fillColor(lightGray).fill();
    doc.fillColor('black');
    // Add the details

    doc.text('Emisor', h2col1, pv);
    doc.text('Receptor', h1col2, pv);
    pv += nl;
    doc.text(Nombre, h2col1, pv);
    doc.text(rNombre, h1col2, pv);
    pv += nl;
    doc.text(Rfc, h2col1, pv);
    doc.text(rRfc, h1col2, pv);
    pv += nl;
    doc.text('Regimen Fiscal:' + RegimenFiscal, h2col1, pv);
    doc.text('Regimen Fiscal:' + RegimenFiscalReceptor, h1col2, pv);
    pv += nl;
    doc.text('Lugar de expedición:' + LugarExpedicion, h2col1, pv);
    doc.text('codigoPostal:' + DomicilioFiscalReceptor, h1col2, pv);
    pv += nl;
    pv += nl;
    var h3col1 = calcularPosicionColumna(margenI, margenD, 2, 1);
    var h3col2 = calcularPosicionColumna(margenI, margenD, 2, 2);
    doc.rect(h3col1, pv - 2, anchoPagina - (margenI + margenD), nl - 2).fillColor(lightGray).fill();
    doc.fillColor('black');
    doc.text('Datos del CFDI', h3col1, pv);
    pv += nl;
    doc.text('Uso del CFDI:' + UsoCFDI, h3col1, pv);
    doc.text('Exportacion: ', h3col2, pv);
    pv += nl
    doc.text('Método de pago:' + MetodoPago, h3col1, pv);
    doc.text('Moneda: ' + Moneda, h3col2, pv);
    pv += nl
    doc.text('Forma de pago:' + FormaPago, h3col1, pv);
    doc.text('Tipo de cambio:' + TipoCambio, h3col2, pv);
    pv += nl
    console.log('ultima posicion del encabezado: ' + pv);
}

function generateHeaderPaid(doc, margenI, margenD, margenUp, margenDw, nl, puntosPorPulgada, anchoPagina, xmlObj) {
    const { Version } = xmlObj['cfdi:Complemento']['pago20:Pagos']
    const { MontoTotalPagos, TotalRetencionesIVA } = xmlObj['cfdi:Complemento']['pago20:Pagos']['pago20:Totales']
    // ['pago20:Pago']{}
    const { CtaBeneficiario, FechaPago, FormaDePagoP, MonedaP, Monto, RfcEmisorCtaBen, TipoCambioP } = xmlObj['cfdi:Complemento']['pago20:Pagos']['pago20:Pago']
    const DoctoRelacionado = xmlObj['cfdi:Complemento']['pago20:Pagos']['pago20:Pago'] //['pago20:DoctoRelacionado']
    // DoctoRelacionado
    Array.isArray(DoctoRelacionado)

    const lpagos = DoctoRelacionado['pago20:DoctoRelacionado'];
    console.log(' complementos:' + Array.isArray(DoctoRelacionado));
    console.log(JSON.stringify(lpagos));
    console.log(' fin complementos:');
}


function generateInvoiceTable(doc, margenI, margenD, margenUp, margenDw, nl, anchoPagina, Conceptos) {
    let i;
    const lightGray = [211, 211, 211];
    var pv = 220;
    var d0col1 = calcularPosicionColumna(margenI, margenD, 2, 1);
    doc.font("Helvetica-Bold", size = 7);
    doc.rect(d0col1, pv - 2, anchoPagina - (margenI + margenD), nl - 2).fillColor(lightGray).fill();
    doc.fillColor('black');
    var isheader = true;
    generateTableRow(isheader,
        doc,
        pv, nl, margenI, margenD,
        'Clave Prod./Serv.', 'Concepto', 'Clave Unidad', 'Cantidad', 'Precio Unit.', 'Descuento', 'Importe'
    );
    // generateHr(doc, invoiceTableTop + nl);
    doc.font("Helvetica");
    isheader = false;
    console.log('Conceptos' + Conceptos.length);
    var subtotal = 0;
    var d0col2 = calcularPosicionColumna(margenI, margenD, 12, 3);
    var d0col3 = calcularPosicionColumna(margenI, margenD, 12, 5);
    var maxWidthConcepto = d0col3 - d0col2;
    pv += nl;
    for (i = 0; i < Conceptos.length; i++) {
        const item = Conceptos[i];
        console.log(i + '-item:' + JSON.stringify(item));

        subtotal += Number(item.Importe);
        var conceptoLines = splitIntoJustifiedLines(item.Descripcion, maxWidthConcepto);
        console.log(i + 'concepto lines:' + conceptoLines.length);
        generateTableRow(isheader, doc, pv, nl, margenI, margenD, item.ClaveProdServ, conceptoLines, item.ClaveUnidad,
            item.Cantidad, formatCurrency(item.ValorUnitario), 0, formatCurrency(item.Importe));
        if (conceptoLines.length > 0) { pv = pv + (conceptoLines.length * nl) }
        // generateHr(doc, position + 20);
    }
    pv += nl;
    // const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(isheader, doc, pv, nl, margenI, margenD, '', '', '', '', '', 'Subtotal ', formatCurrency(subtotal));

}
function generateTableRow(isheader, doc, y, nl, margenI, margenD, claveProdServ, conceptos, claveUnidad, cantidad, precioUnitario, descuento, importe) {
    var d0col1 = calcularPosicionColumna(margenI, margenD, 12, 1);
    var d0col2 = calcularPosicionColumna(margenI, margenD, 12, 3);
    var d0col3 = calcularPosicionColumna(margenI, margenD, 12, 5);
    var d0col4 = calcularPosicionColumna(margenI, margenD, 12, 6);
    var d0col5 = calcularPosicionColumna(margenI, margenD, 12, 7);
    var d0col6 = calcularPosicionColumna(margenI, margenD, 12, 9);
    var maxWidthConcepto = d0col3 - d0col2;
    // doc
    doc.fontSize(7)
    var ren = y;
    doc.text(claveProdServ, d0col1, y)
    if (isheader) {
        doc.text(conceptos, d0col2, y)
    } else {
        for (let i = 0; i < conceptos.length; i++) {
            doc.text(conceptos[i], d0col2, ren, { align: 'justify', maxWidthConcepto });
            ren += nl;
        }
    }
    // doc.text(concepto, d0col2, y)
    doc.text(claveUnidad, d0col3, y, { width: 90, align: "right" });
    doc.text(cantidad, d0col4, y, { width: 90, align: "right" })
    doc.text(precioUnitario, d0col5, y, { width: 90, align: "right" })
    doc.text(importe, d0col6, y, { align: "right" });
}
function generateFooter(doc, margenI, margenD, margenUp, margenDw, nl, anchoPagina, xmlObj, qrStr) {
    const { Version, Sello } = xmlObj
    const { SelloSAT, Version: VersionT, UUID, FechaTimbrado, NoCertificadoSAT } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
    const CadenaOriginal = '||' + VersionT + '|' + UUID + '|' + FechaTimbrado + '| ' + Sello + '|' + NoCertificadoSAT + '||'

    const lightGray = [211, 211, 211];
    var pv = doc.y + nl;
    var f1col1 = calcularPosicionColumna(margenI, margenD, 1, 1);
    // doc.rect(f1col1 - nl, pv - 2, anchoPagina - (margenI + margenD), nl - 2).fillColor(lightGray).fill();
    doc.fillColor('black');
    doc.text('Notas', f1col1, pv);
    var f1col1 = calcularPosicionColumna(margenI, margenD, 5, 1);
    pv += nl;
    pv += nl;
    //coloca QR
    // console.log('Qr:' + qrStr);
    // base64Img.img(qrStr, '', 'qr', { dataUri: true }, (err, img) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }

    // Insert the QR code image into the PDF
    doc.image(qrStr, f1col1, pv, { width: 110, height: 110 });

    console.log('PDF with QR code generated successfully font height:' + doc.font.fontSize);
    // });
    doc.font('Helvetica').fontSize(6);

    var f1col2 = calcularPosicionColumna(margenI, margenD, 5, 2);
    doc.text('Sello Digital del CFDI', f1col2, pv);
    pv += nl;
    maxWidthFooter = anchoPagina - margenI - margenD - f1col2;
    var sellolines = splitIntoJustifiedLines(Sello, maxWidthFooter);
    for (let i = 0; i < sellolines.length; i++) {
        // const lineY = yPos + (i * doc.font.height); // Calculate y position for each line based on font height
        doc.text(sellolines[i], f1col2, pv, { align: 'justify', maxWidthFooter });
        pv += nl;
    }
    pv += nl;
    // pv += nl;
    doc.text('Sello Digital del SAT', f1col2, pv);
    pv += nl;
    var selloSatlines = splitIntoJustifiedLines(SelloSAT, maxWidthFooter);
    for (let i = 0; i < selloSatlines.length; i++) {
        doc.text(selloSatlines[i], f1col2, pv, { align: 'justify', maxWidthFooter });
        pv += nl;
    }
    pv += nl
    // pv += nl;
    doc.text('Cadena original del complemento de certificación digital del SAT', f1col2, pv);
    pv += nl;
    var cadenalines = splitIntoJustifiedLines(CadenaOriginal, maxWidthFooter);
    for (let i = 0; i < cadenalines.length; i++) {
        doc.text(cadenalines[i], f1col2, pv, { align: 'justify', maxWidthFooter });
        pv += nl;
    }
    // doc.text(CadenaOriginal, f1col2, pv);
    //sello
    pv += nl;
    pv += nl;
    pv += nl;
    doc.text('Este documento es una representacion impresa de un CFDI version 3.3', f1col1, pv);

}
function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function calcularPosicionColumna(margenIzquierdo, margenDerecho, numeroColumnas, columnaActual) {
    // Convertir pulgadas a puntos
    const puntosPorPulgada = 72;
    const anchoPagina = 8.5 * puntosPorPulgada; // Tamaño carta

    // Calcular el ancho disponible para las columnas
    const anchoDisponible = anchoPagina - margenIzquierdo - margenDerecho;

    // Calcular el ancho de cada columna
    const anchoColumna = anchoDisponible / numeroColumnas;

    // Calcular la posición horizontal de la columna actual
    const posicionColumna = margenIzquierdo + (columnaActual - 1) * anchoColumna;

    return posicionColumna;
}

function calcularPosicionFinalTexto(posicionInicial, texto) {
    // Convertir pulgadas a puntos
    const puntosPorPulgada = 72;
    const anchoPagina = 8.5 * puntosPorPulgada; // Tamaño carta

    // Obtener el ancho del texto
    const anchoTexto = getTextWidth(texto, { size: 7 });

    // Calcular la posición final del texto
    const posicionFinal = posicionInicial + anchoTexto;

    // Si la posición final es mayor que el ancho de la página, retornar el ancho de la página
    if (posicionFinal > anchoPagina) {
        return anchoPagina;
    }

    return posicionFinal;
}

// Función para obtener el ancho del texto (depende de la biblioteca que uses para generar el PDF)
function getTextWidth(texto, opciones) {
    // Implementar esta función según la biblioteca que uses
    return 100; // Ejemplo
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

//-------
// const doc = new pdfkit();

// const paragraphText = "This is a long paragraph that needs to be justified within a specific area.";
// const xPos = 20; // X-coordinate of the paragraph starting point
// const yPos = 50; // Y-coordinate of the paragraph starting point
// const maxWidth = 150; // Maximum width of the paragraph

// // Calculate the available height based on the current y position and page height
// const maxHeight = doc.page.height - yPos;

// Create a function to split the text into lines considering max width and justification
function splitIntoJustifiedLines(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = "";

    for (const word of words) {
        const lineLength = currentLine.length + word.length + 1; // Consider spaces between words
        if (lineLength > maxWidth) {
            // Justify the current line (distribute extra spaces evenly)
            const spacesToAdd = maxWidth - currentLine.length;
            const numSpaces = lines.length ? spacesToAdd + 1 : spacesToAdd; // Add one extra space for the first line
            const wordSpacing = spacesToAdd / (numSpaces - 1); // Calculate spacing between words
            let justifiedLine = "";
            const wordParts = currentLine.split(' ');
            for (let i = 0; i < wordParts.length; i++) {
                justifiedLine += wordParts[i];
                if (i < wordParts.length - 1) {
                    justifiedLine += " ".repeat(Math.floor(wordSpacing)); // Add spaces based on calculated spacing
                }
            }
            lines.push(justifiedLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}



//-------

module.exports = {
    createCFDI4Payment
};
