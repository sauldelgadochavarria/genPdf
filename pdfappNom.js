// const { readInput, pausa } = require('./js/inquirer.js');
const Cfdi = require('./js/cfdi.js');
const fs = require('fs');
// const pdf = require('html-pdf')
const qrcode = require('qrcode')
const totalEnLetra = require('./js/totalEnLetra.js')
// const pdfTemplate = require('./js/template')
//----------------------------------------------------------------
// const pdfMake = require("pdfmake/build/pdfmake");
// const pdfFonts = require("pdfmake/build/vfs_fonts");
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// const fs = require("fs");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM("");
// const htmlToPdfMake = require("html-to-pdfmake");
const parseString = require('xml2js').parseString;
//----------------------------------------------------------------
// const { createCFDI4Invoice } = require("./tstPdfIngreso.js");
const { createCFDI4Nom } = require("./tstPdfNom.js");


const main = async () => {
  // const fac = new Cfdi();
  // const inputValue = await readInput('Número de factura:', fac.lastFac + 1) || fac.lastFac + 1;

  // const xmlPath = `./xmls/1573.xml`
  const xmlPath = `./xmls/nom.xml`;
  if (!fs.existsSync(xmlPath)) {
    console.log(`no existe el XML de la factura ${inputValue}`)
    return
  }

  const xml = fs.readFileSync(xmlPath, { encoding: 'utf-8' })

  parseString(xml, { mergeAttrs: true, explicitArray: false }, (err, result) => {

    const xmlObj = result['cfdi:Comprobante']
    const totalLetra = totalEnLetra(xmlObj.Total).toLowerCase() + 'MXN'
    const { UUID } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
    const { Rfc } = xmlObj['cfdi:Emisor']
    const { Rfc: rRfc } = xmlObj['cfdi:Receptor']
    const { Total, Sello } = xmlObj
    const Sello8 = Sello.slice(-8)
    const urlBase = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'
    const qrStr = `${urlBase}?id=${UUID}&re=${Rfc}&rr=${rRfc}&tt=${Total}&fe=${Sello8}`
    // const logo = 'data:image/png;base64,' + fs.readFileSync('./misc/logo.png', {encoding: 'base64'}) || '';
    const logo = './logo.png';

    // const options = { "format": "Letter", "border": "0px", "localUrlAccess": true, "base": `file://${__dirname}/`, };
    qrcode.toDataURL(qrStr).then(qr => {

      // new version 

      // old version
      // var HTML = pdfTemplate(xmlObj, qr, logo, totalLetra)
      // const html = htmlToPdfMake(HTML, {
      //   window
      // });
      // const docDefinition = {
      //   content: [html],
      //   // pageOrientation: "landscape",
      //   styles: {
      //     "html-h1": {
      //       color: "#003366",
      //       background: "white",
      //     },
      //   },
      // };
      // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      // pdfDocGenerator.getBuffer(function (buffer) {
      //   fs.writeFileSync("companies.pdf", buffer);
      // });


      // createCFDI4Invoice(xmlObj, "cfdi4.pdf", qr)
      createCFDI4Nom(xmlObj, "nom.pdf", qr)

    })
  });
}

main();