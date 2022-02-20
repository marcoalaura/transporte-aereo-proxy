'use strict';

const debug = require('debug')('proxy:web');
const http = require('http');
const chalk = require('chalk');
const express = require('express');
const asyncify = require('express-asyncify');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { handleFatalError } = require('./src/lib/util');
const api = require('./src/api');

const port = process.env.PORT_PROXY || 3300;
const app = asyncify(express());
const server = http.createServer(app);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.use('/api', api);

// Documentación
app.get('/documentacion', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/docs/index.html'));
});

app.get('/redoc.js', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/docs/redoc.js'));
});

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`);

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }

  if (err.message.match(/jwt expired/)) {
    return res.status(401).send({ error: 'Su sesión ha expirado, ingrese nuevamente al sistema.' });
  }

  if (err.message.match(/No authorization/)) {
    return res.status(403).send({ error: 'No tiene permisos para realizar esta operación.' });
  }

  if (err.message.match(/invalid token/)) {
    return res.status(403).send({ error: 'Su token es inválido.' });
  }

  res.status(500).send({ error: err.message });
});

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

server.listen(port, () => {
  console.log(`${chalk.green('[proxy-web]')} server listening on port ${port}`);
});

module.exports = server;
