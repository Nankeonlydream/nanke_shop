const express = require('express');
const compression = require('compression');
var app = express()

app.use(compression());
const history = require('connect-history-api-fallback')
app.use(history());

app.use(express.static('./dist'));

app.listen(80, () => {
  console.log('server running at http://120.24.162.162');
})