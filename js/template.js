module.exports = (xmlObj, qr, logo, totalLetra) => {


    const { Version, Folio, Fecha, Sello, FormaPago, NoCertificado, Certificado, SubTotal, Descuento = "0.00", Moneda, TipoCambio, Total, TipoDeComprobante, Exportacion, MetodoPago, LugarExpedicion } = xmlObj
    const { Rfc, Nombre, RegimenFiscal } = xmlObj['cfdi:Emisor']
    const { Rfc: rRfc, Nombre: rNombre, DomicilioFiscalReceptor, RegimenFiscalReceptor, UsoCFDI } = xmlObj['cfdi:Receptor']
    console.log('rrfc:' + rRfc + ' Rfc' + Rfc + ' Rfc' + Rfc + ' nombre:' + rNombre);
    const Concepto = xmlObj['cfdi:Conceptos']['cfdi:Concepto']
    console.log('Concepto' + JSON.stringify(Concepto));
    const concepto = Concepto.length ?

        Concepto.map(Conce => {

            return `
                <tr class="item">
                <td>${Conce.ClaveProdServ}</td>
                <td>${Conce.Descripcion}</td>
                <td class="center">${Conce.ClaveUnidad}</td>
                <td class="right">${Conce.Cantidad}</td>
                <td class="right">$${Conce.ValorUnitario}</td>
                <td class="right">$${Conce.Descuento ? Conce.Descuento : '0.00'}</td>
                <td class="right">$${Conce.Importe}</td>
                </tr>   
                `
        }
        ).join('') :

        `
        <tr class="item">
        <td>${Concepto.ClaveProdServ}</td>
        <td>${Concepto.Descripcion}</td>
        <td class="center">${Concepto.ClaveUnidad}</td>
        <td class="right">${Concepto.Cantidad}</td>
        <td class="right">$${Concepto.ValorUnitario}</td>
        <td class="right">$${Concepto.Descuento ? Concepto.Descuento : '0.00'}</td>
        <td class="right">$${Concepto.Importe}</td>
        </tr>   
        `

    const impTra = xmlObj['cfdi:Impuestos'] ?
        `<tr>
            <td class="chaparro w99"></td>
            <td class="chaparro right"><b>Impuestos Trasladados: </b></td>
            <td class="chaparro right">$${xmlObj['cfdi:Impuestos'].TotalImpuestosTrasladados ? xmlObj['cfdi:Impuestos'].TotalImpuestosTrasladados : '0.00'}</td>
        </tr>`
        :
        ''
    const impRet = xmlObj['cfdi:Impuestos'] ?
        `<tr>
            <td class="chaparro w99"></td>
            <td class="chaparro right"><b>Total de Impuestos Retenidos: </b></td>
            <td class="chaparro right">$${xmlObj['cfdi:Impuestos'].TotalImpuestosRetenidos ? xmlObj['cfdi:Impuestos'].TotalImpuestosRetenidos : '0.00'}</td>
         </tr>`
        :
        ''

    const { SelloSAT, Version: VersionT, UUID, FechaTimbrado, NoCertificadoSAT } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']

    const CadenaOriginal = '||' + VersionT + '|' + UUID + '|' + FechaTimbrado + '| ' + Sello + '|' + NoCertificadoSAT + '||'

    return `


    <!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CFDI_4.0</title>
    <link href="./styles.css"  type="text/css" rel="stylesheet">
</head>

<body>
    <div class="invoice-box">
        <table>
            <tr class="top">
                <td colspan="100%">
                    <table>
                        <th rowspan="2" class="logo-box">
                            <img src="${logo}" alt="logo" class="logo" />
                        </th>
                        <th colspan="2" class="arriba fac">Factura - ${TipoDeComprobante === 'I' ? 'Ingreso' : ''}</th>
                        <tr>
                            <td class="subtitle">
                                Folio: <span class="red">${Folio}</span> <br />
                                Fecha de emisión: ${Fecha}<br />
                                Fecha de certificación: ${FechaTimbrado}
                            </td>
                            <td class="subtitle">
                                Folio fiscal: ${UUID} <br />
                                No. Certificado Digital: ${NoCertificado}<br />
                                No. Certificado SAT: ${NoCertificadoSAT}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="100%">
                    <table>
                        <th class="w50 arriba emisor">Emisor</th>
                        <th class="w50 arriba receptor">Receptor</th>
                        <tr>
                            <td class="w50">
                                <b>${Nombre}</b><br />
                                ${Rfc}<br />
                                Regimen Fiscal: ${RegimenFiscal}<br />
                                Lugar de expedición: ${LugarExpedicion}
                            </td>
                            <td class="w50 receptor">

                                <b>${rNombre}</b><br />
                                ${rRfc}<br />
                                Regimen Fiscal: ${RegimenFiscalReceptor}<br />
                                Código Postal: ${DomicilioFiscalReceptor}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <tr class="information margen">
                <td colspan="100%">
                    <table>
                        <th colspan="2" class="arriba">Datos del CFDI</th>

                        <tr>
                            <td class="w50">
                                Uso del CFDI: ${UsoCFDI}<br />
                                Método de pago: ${MetodoPago}<br />
                                Forma de pago: ${FormaPago}
                            </td>
                            <td class="w50">
                                Exportacion: ${Exportacion}<br />
                                Moneda: ${Moneda}<br />
                                Tipo de cambio: ${TipoCambio}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>



            <tr class="arriba center margen">
                <td>Clave Prod./Serv.</td>
                <td>Concepto</td>
                <td>Clave Unidad</td>
                <td>Cantidad</td>
                <td>Precio Unitario</td>
                <td>Descuento</td>

                <td>Importe</td>
            </tr>
            
            ${concepto}


        </table>

        <tr class="information totales">
            <td colspan="100%">
                <table>
                    <tr>
                    <br/>
                        <td class="chaparoo w99">Total en letra: ${totalLetra}</td>
                        <td class="chaparoo right"><b>Sub-Total</b></td>
                        <td class="chaparoo right">$${SubTotal} </td>
                    </tr>
                    <tr>
                        <td class="chaparoo w99"></td>
                        <td class="chaparoo right"><b>Descuento</b></td>
                        <td class="chaparoo right">$${Descuento} </td>
                    </tr>
                    ${impTra}
                    <tr>
                        <td class="chaparoo w99">Comentarios:</td>
                        <td class="chaparoo right"><b>Total</b></td>
                        <td class="chaparoo right">$${Total}</td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr class="information">
            <td colspan="100%">
                <table class="layout-fixed">
                    <tr>

                        <td class="w25" rowspan="3"><img src="${qr}" style="max-width:100%" /></td>
                        <td class="sello"><b>Sello Digital del CFDI</b><br />
                            ${Sello}
                        </td>
                    </tr>
                    <tr>
                        <td class="sello"><b>Sello Digital del SAT</b><br />
                            ${SelloSAT}
                        </td>
                    </tr>

                    <tr>
                        <td class="sello"><b>Cadena original del complemento de certificación digital del SAT</b><br />
                            ${CadenaOriginal}
                        </td>
                    </tr>
                    <td colspan="100%" class="sello center"><b>Este documento es una representacion impresa de un CFDI
                            version ${Version}</b><br />
                    </td>


                </table>
            </td>
        </tr>


    </div>

</body>

</html>
<style>
html { -webkit-print-color-adjust: exact; }
</style>
            `

}