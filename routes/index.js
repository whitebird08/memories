require('dotenv').load();
var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = process.env.DATABASE_URL || 'postgres://@localhost/memoriesapp';

router.get('/api/v1/memories', function(req, res, next) {
  console.log('...connected')
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM memories', function(err,  result) {
      
      var modifiedResult = {
        links: {},
        data: []
      }
      
      for(var i=0; i<result.rows.length; i++){
        var fabulousObject = {
          type: 'memory',
          id: result.rows[i].id,
          attributes: {
            old_days: result.rows[i].old_days,
            these_days:result.rows[i].these_days,
            year:result.rows[i].year
          },
          links: {}
        }
        modifiedResult.data.push(fabulousObject)
      }
      
      done();

      if (err) {
        return console.error('error running query', err);
      }
      res.send(modifiedResult);
    });
  });
});


/* GET users listing. */
router.post('/api/v1/memories', function(req, res, next) {
  console.log('...conected')
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT into memories(old_days, these_days, year) values($1, $2, $3)', [req.body.data.attributes.old_days, req.body.data.attributes.these_days, req.body.data.attributes.year], function(err, result) {
      done();

      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

router.get('/api/v1/memories/:year', function(req, res, next) {
  console.log('...connected')
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM memories WHERE year = $1', [req.params.year], function(err,  result) {
      console.log(result, '...RESULT...')
      
      var modifiedResult = {
        links: {},
        data: []
      }
      
      for(var i=0; i<result.rows.length; i++){
        var fabulousObject = {
          type: 'memory',
          id: result.rows[i].id,
          attributes: {
            old_days: result.rows[i].old_days,
            these_days:result.rows[i].these_days,
            year:result.rows[i].year
          },
          links: {}
        }
        modifiedResult.data.push(fabulousObject)
      }
      
      done();

      if (err) {
        return console.error('error running query', err);
      }
      res.send(modifiedResult);
    });
  });
});


module.exports = router;
