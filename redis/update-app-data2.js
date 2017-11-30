var path = require('path')
var fs = require('fs')
var redis = require('redis')
var async = require('async')

// var client = redis.createClient(6379, 'localhost')
var client = redis.createClient('31578', '10.1.2.70')
var dataFolderPath = path.resolve('./data')
var mappingFilePath = path.resolve('./data/mapping.json')

//client.on("error", function (err) {
//    console.log("Error " + err)
//})

fs.readFile(mappingFilePath, 'utf8', function (err, data) {
  var folderMappings = JSON.parse(data)
  async.eachSeries(folderMappings, function(mapping, callback) {
    var folderPath = path.join(dataFolderPath, mapping.folder)
    async.series([
      function(callback) {
        client.select(mapping.redisIndex, function () {
          console.log("set db: " + mapping.redisIndex)
          callback()
        })
      },
      function(callback) {
        fs.readdir(folderPath, function (err, files) {
          async.eachSeries(files, function (file, callback) {
            var objFilePath = path.join(folderPath, file)
            fs.readFile(objFilePath, 'utf8', function (err, data) {
              if(err) return console.log(err)
              var obj = JSON.parse(data)
              client.send_command("json.set", [obj[mapping.key], '.', JSON.stringify(obj)], function (err, result) {
                if(err) return console.log(err)
                //console.log(obj[mapping.key] + " set")
                callback()
              })
            })
          }, function (err) {
            console.log('Finished looping files')
            callback()
          })
        })
      }
    ], function (err, result) {
      callback()
    })

  }, function (err) {
    console.log('Finished looping folders, quitting')
    client.quit()
  })
})