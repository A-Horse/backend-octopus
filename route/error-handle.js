'use strict';

var express = require('express');

export function log(err, req, res, next) {
  console.log(err.message);
  console.log(err.stack);
  next(err);
}


export function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}


export function errorHandler(err, req, res, next) {
  res.status(500);
  //res.render('../templates/error', { error: err.message, stack: err.stack });
  res.send({
    error: {
      name: err.name,
      message: err.message,
      code: err.code
    }
  });
}
 
