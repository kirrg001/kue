
/*!
 * q - http
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');

// setup

var app = express.createServer()
  , provides = require('./middleware/provides')
  , stylus = require('stylus')
  , routes = require('./routes')
  , json = require('./routes/json')
  , util = require('util')
  , nib = require('nib');

// expose the app

module.exports = app;

// stylus config

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

// config

app.set('view options', { doctype: 'html' });
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('title', 'Kue');
app.helpers({ inspect: util.inspect });
app.helpers(require('./helpers/job'));

// middleware

app.use(express.favicon());
app.use(app.router);
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
app.use(express.static(__dirname + '/public'));

// JSON api

app.get('/stats', provides('json'), json.stats);
app.get('/jobs/:type/:status/:from..:to', provides('json'), json.jobTypeRange);
app.get('/jobs/:status/:from..:to', provides('json'), json.jobRange);
app.get('/job/types', provides('json'), json.types);
app.get('/job/:id', provides('json'), json.job);
app.put('/job/:id/priority/:priority', provides('json'), json.updatePriority);
app.get('/job/:id/log', provides('json'), json.log);
app.del('/job/:id', provides('json'), json.remove);

// routes

app.get('/', routes.jobs('active'));
app.get('/active', routes.jobs('active'));
app.get('/inactive', routes.jobs('inactive'));
app.get('/failed', routes.jobs('failed'));
app.get('/complete', routes.jobs('complete'));
app.get('/job/:id', routes.job);