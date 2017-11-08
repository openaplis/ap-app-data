var path = require('path')
var fs = require('fs')
var redis = require('redis')
var async = require('async')

var client = redis.createClient()
var dataFolderPath = path.resolve('./data')
var mappingFilePath = path.resolve('./data/mapping.json')

client.on("error", function (err) {
    console.log("Error " + err)
})

/*
client.send_command("json.set", [3, '.', '{"name": "BOB"}'], function (err, result) {
  if(err) return console.log(err)
  client.send_command("json.get", [3], function (err, result) {
    if(err) return console.log(err)
    console.log(result)
  })
})
*/

fs.readFile(mappingFilePath, 'utf8', function (err, data) {
  var folderMappings = JSON.parse(data)
  async.each(folderMappings, function(mapping, callback) {
    var folderPath = path.join(dataFolderPath, mapping.folder)
    fs.readdir(folderPath, function (err, files) {
      async.each(files, function (file, callback) {
        var objFilePath = path.join(folderPath, file)
        fs.readFile(objFilePath, 'utf8', function (err, data) {
          var obj = JSON.parse(data)
          client.send_command("json.set", [obj[mapping.key], '.', JSON.stringify(obj)], function (err, result) {
            if(err) return console.log(err)
            console.log(obj[mapping.key] + " sent")
          })
        })
      })
    })
  })
})
