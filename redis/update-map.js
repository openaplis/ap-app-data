var path = require('path')
var fs = require('fs')
var redis = require('redis')
var async = require('async')

var client = redis.createClient('31578', '10.1.2.70')
var mappingFilePath = path.resolve('./data/mapping.json')

fs.readFile(mappingFilePath, 'utf8', function (err, data) {
  var folderMappings = JSON.parse(data)
  async.each(folderMappings, function(mapping, callback) {
    console.log(mapping)
  })
})
