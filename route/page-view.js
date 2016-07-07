'use strict';

let express = require('express'),
    PageViewRouter = express.Router();

import validator from 'validator';

var xssFilters = require('xss-filters'); //for display

import {Page} from '../model/page';

PageViewRouter.get('/page/:id', (req, res, next) => {
  let id = req.params.id;
  if( !id ){
    res.status(400).end();
  } else {
    Page.getPageById(id)
      .then((page) => {
        res.render('page.ejs', {page: page.toJSON()});
      });
  }
});


export {PageViewRouter};
