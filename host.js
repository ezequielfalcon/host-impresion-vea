const express = require('express');
const app = express();
const bodyParser = require('body-parser');




function imprimir(nPedido, items) {
  const escpos = require('escpos');
  const device  = new escpos.Network('172.16.1.10');
  const options = { encoding: "windows1252" /* default */ };
  const printer = new escpos.Printer(device, options);
  device.open(() => {
    printer
      .font('a')
      .align('ct')
      .style('bu')
      .size(2, 2)
      .text('Pedido #' + nPedido)
      .control('LF')
      .text('LAESO CHASCOMUS')
      .control('LF')
      .control('LF')
      .font('a')
      .align('lt')
      .style('bu')
      .size(1, 1);
    for (const item of items) {
      printer
        .text(item);
    }
    printer
      .font('a')
      .align('ct')
      .style('bu')
      .size(2, 2)
      .control('LF')
      .control('LF')
      .text('-----------')
      .control('LF')
      .control('LF')
      .cut('full')
      .close();
  })


}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('port', process.env.PORT || 5050);

app.get('/', (req, res) => {
  res.json({
    mensaje: "Host de Impresión VEA"
  })
});

app.post('/imprimir', (req, res) => {
  if (req.body.npedido && req.body.items) {
    const itemsPedido = req.body.items.split(',');
    imprimir(req.body.npedido, itemsPedido);
    res.json({mensaje: "Ticket impreso!!"}).end();
  } else {
    res.status(400).end();
  }
})



app.listen(app.get('port'), () => {
  console.log('Host de impresión escuchando en puerto ', app.get('port'));
})
