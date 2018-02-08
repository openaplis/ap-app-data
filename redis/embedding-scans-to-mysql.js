var path = require('path')
var fs = require('fs')
var redis = require('redis')
var async = require('async')
const cmdSubmitter = require('ap-mysql').cmdSubmitter

var client = redis.createClient('6379', '10.1.2.25')  //depreciated
var cnt = 0
var errorCnt = 0

client.keys('EmbeddingScan:*', function(err, keys) {
  if(err) console.log(err)
  async.eachSeries(keys, function(key, callback) {
    client.hvals(key, function(err, result) {
      if(err) return(err)
      var obj = {}
      obj.AliquotOrderId = result[0]
      obj.ProcessorStartTime = result[1]
      obj.ProcessorFixationDuration = result[2]
      obj.DateScanned = result[3]
      obj.ScannedById = result[4]
      obj.ScannedBy = result[5]
      obj.Updated = result[6]
      var objString = JSON.stringify(obj)
      var date = new Date(result[3])
      var mo = date.getMonth() + 1
      var dt =  '' + date.getFullYear() + '-' + mo + '-' + date.getDate()
      var cmd = ['insert tblEmbeddingScan(EmbeddingScan, DateScanned, AliquotOrderId) values (\'',
        objString, '\', \'', dt, '\', \'', result[0], '\');'].join('')
      cmdSubmitter.submit(cmd, function(err, result) {
        if(err) {
          errorCnt = errorCnt + 1
          console.log("Error: " + err)
          callback()
        } else {
          cnt = cnt + 1
          console.log(cnt)
          callback()
        }
      })
    })
  }, function (err) {
    if(err) console.log(err)
    client.quit()
    console.log("Finished")
  })
})
