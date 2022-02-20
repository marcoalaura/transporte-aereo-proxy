'use strict';

const debug = require('debug')('proxy:util');
const { graphqlUrl, apiToken } = require('../config');
const request = require('request');
const chalk = require('chalk');

function http (options) {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      const { statusCode } = response;
      debug('error:', error);
      debug('statusCode:', statusCode);
      debug('body:', body);

      if ([400, 500].indexOf(statusCode) !== -1) {
        reject(body);
      }

      resolve(body);
    });
  });
}

function parseErrorGraphql (errors) {
  if (Array.isArray(errors)) {
    let msg = [];
    errors.map(el => {
      if (el.message.indexOf('NOT_AUTHORIZED') === 0) {
        msg.push('No tiene los permisos necesarios para realizar esta operación.');
      } else {
        let message = '<p>';
        if (el.name) {
          message += `<strong>Error: </strong>${el.name} <br />`;
        }
        message += `<strong>Mensaje: </strong> ${el.message}</p>`;
        msg.push(message);
      }
    });
    return msg.join('');
  }
}

async function graphql (query) {
  const options = {
    method: 'POST',
    url: `${graphqlUrl}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true,
    body: query
  };

  let result;
  try {
    debug('---------------------------', result);
    result = await http(options);
    if (result.errors) {
      throw new Error(parseErrorGraphql(result.errors));
    }
    result = result.data;
  } catch (e) {
    debug('ERROR Graphql *********************************************************', e);
    if (e.errors) {
      throw new Error(parseErrorGraphql(e.errors));
    } else {
      if (e.message && e.message.indexOf('ECONNREFUSED') !== -1) {
        throw new Error('No se pudo establecer conexión con el servidor, inténtelo dentro unos minutos.');
      } else {
        throw new Error(e.message);
      }
    }
  }

  return result;
}

function find (text, array) {
  for (let i in array) {
    if (text.indexOf(array[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function getToken (req) {
  const { headers } = req;

  if (headers.authorization && typeof headers.authorization === 'string') {
    return req.headers.authorization.replace('Bearer ', '');
  }
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

function handleError (err) {
  console.error(`${chalk.red('[error]')} ${err.message}`);
  console.error(err.stack);
}

module.exports = {
  graphql,
  find,
  getToken,
  handleFatalError,
  handleError
};
