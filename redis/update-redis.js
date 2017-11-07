var path = require('path')
var fs = require('fs')
var redis = require('redis')

var client = redis.createClient()
var dataFolderPath = path.resolve('../data')
var mappingFilePath = path.resolve('./data/mapping.json')

//client.on("error", function (err) {
//    console.log("Error " + err)
//})
console.log(mappingFilePath)

/*
fs.readFile(mappingFilePath, 'utf8', function (err, data) {
  var folderMappings = JSON.parse(data)
  for(i=0; i<folderMappings.length; i++) {
    var dataFolderPath = path.join(dataFolderPath, folderMappings[i].folder)
    console.log(dataFolderPath)
    fs.readdir(dataFolderPath, function (err, files) {
      for(i=0; i<files.length; i++) {
        console.log(files[i])
      }
    })
  }
})
*/

/*
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
*/
