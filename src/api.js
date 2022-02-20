'use strict';

const debug = require('debug')('proxy:web:api');
const express = require('express');
const request = require('request-promise-native');
const asyncify = require('express-asyncify');
const api = asyncify(express.Router());
const { apiUrl } = require('./config');
const { getToken } = require('./lib/util');
const fs = require('fs');
const path = require('path');

// Creación de itinerarios
api.post('/itinerario/crear', async (req, res, next) => {
  debug(`Creando itinerario de vuelos`);

  const options = {
    url: `${apiUrl}itinerario/ws/crear_solicitud`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }

  res.send(result);
});

// Creación de itinerarios
api.get('/itinerario/estado/:id', async (req, res, next) => {
  debug(`Verificando el estado del itinerario de vuelos`);

  if (!req.params.id) {
    return res.status(400).send({ error: 'El ID de la solicitud es obligatorio' });
  }

  const options = {
    url: `${apiUrl}itinerario/ws/estado_solicitud/${req.params.id}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }

  res.send(result);
});

// Cargar pasajeros del vuelo
api.post('/vuelo/pasajeros', async (req, res, next) => {
  debug(`Asignando pasajeros al vuelo`);

  const options = {
    url: `${apiUrl}vuelo/ws/cargar_pasajeros`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }

  res.send(result);
});

// Actualizar estado del vuelo
api.post('/vuelo/actualizar', async (req, res, next) => {
  debug(`Actualizando el estado del vuelo`);

  const options = {
    url: `${apiUrl}vuelo/ws/actualizar_estado `,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }

  res.send(result);
});

// Reprogramar vuelo
api.post('/vuelo/reprogramar', async (req, res, next) => {
  debug(`Reprogramar vuelo`);

  const options = {
    url: `${apiUrl}vuelo/ws/reprogramar`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }
  res.send(result);
});

// Cancelar vuelo
api.post('/vuelo/cancelar', async (req, res, next) => {
  debug(`Cancelar Vuelo`);

  const options = {
    url: `${apiUrl}vuelo/ws/cancelar`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }
  res.send(result);
});

// Cambiar de estado a plan de vuelos no regulares
api.post('/planesVuelosNoRegulares/actualizarEstado/:codPlanVuelo/:estado', async (req, res, next) => {
  debug(`Cambiar estado a plan de vuelos`);

  const { codPlanVuelo, estado } = req.params;

  const options = {
    url: `${apiUrl}plan/planVueloNoRegular/ws/actualizarEstado/${codPlanVuelo}/${estado}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }
  res.send(result);
});

// consultar estado de planes de vuelo no regulares
api.get('/planesVuelosNoRegulares/ws/consultarEstado/:codPlanVuelo', async (req, res, next) => {
  debug(`Consultar estado de plan de vuelos`);

  const { codPlanVuelo } = req.params;

  const options = {
    url: `${apiUrl}plan/planVueloNoRegular/ws/consultarEstado/${codPlanVuelo}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken(req)}`
    },
    body: req.body,
    json: true
  };

  let result;
  try {
    debug('REQUEST', options);
    result = await request(options);
    debug('RESPONSE', result);
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e.error);
    }
    return next(e);
  }
  res.send(result);
});

// Documentación del API con OpenApi y Readoc.js
api.get('/doc', (req, res) => {
  console.log('dir', __dirname);
  let data = JSON.parse(fs.readFileSync(path.join(__dirname.substring(0, __dirname.length - 3), 'docs/api.json'), 'utf8'));
  res.send(data);
});

module.exports = api;
