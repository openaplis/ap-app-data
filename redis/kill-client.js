var path = require('path')
var fs = require('fs')
var redis = require('redis')
var async = require('async')
var _ = require('underscore')

//var client = redis.createClient('31578', '10.1.2.70')
var client = redis.createClient('6379', '10.1.2.25')

client.send_command('client', ['list'], function (err, result) {
  var lines = result.split('\n')
  async.eachSeries(lines, function (line, callback) {
    var fields = line.split(' ')
    if(line.includes('PAMELACLEGG')) {
      var name = fields[3].split('=')[1]
      var addr = fields[1].split('=')[1]
      client.send_command('client', ['kill', 'addr', addr], function (err, result) {
        console.log("result: " + result + ":" + addr)
        callback()
      })
    } else {
      callback()
    }
  }, function (err, result) {
    console.log('done.')
    client.quit()
  })
})
