'use strict';

let express = require('express'),
    PageRouter = express.Router();

import validator from 'validator';

var xssFilters = require('xss-filters'); //for display

import {Page} from '../model/page';

PageRouter.get('/page/:id', (req, res, next) => {
  let id = req.params.id;
  if( !id ){
    res.status(400).end();
  } else {
    Page.getPageById(id)
      .then((page) => {
        console.log(page);
        res.render('page.ejs', {page: page.toJSON()});
      });
  }
});

PageRouter.post('/page', (req, res, next) => {
  let {title, content} = req.body;

  if( title.length > 300 ){
    return res.status(400).en({
      message: "title too long!"
    });
  }
  
  title = xssFilters.inHTMLData(title);
  content = xssFilters.inHTMLData(content);

  new Page(null, title, content)
      .save((page) => {
        res.status(201).end({
          created: page.toString()
        });
      });
});

PageRouter.patch('/page/:id', (req, res, next) => {
  
});

PageRouter.delete('/page/:id', (req, res, next) => {
  
});



export {PageRouter};
