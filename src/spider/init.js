var util = require("../utils/util")
var spiderHttp = require("./index")
var spiderFormat = require("./format")
var connection = require("../mysql/index")

module.exports = function () {
  var timer = null
  var save = function (listArr) {
    if (listArr.length == 0) {
      return
    }
    var list = spiderFormat.listFilter(listArr)
    if (list.length == 0) {
      return
    }
    list.forEach(function (v) {
      v.createTime = util.parseTime(new Date())
      connection.query(`SELECT * FROM log where msgId='${v.id}'`, function (error, results, fields) {
        if (error) throw error
        if (!results[0]) {
          connection.query(
            `INSERT INTO log(msgId, msgSource, msgTitle, msgQuestion, msgAnswer,msgTime, createTime) VALUES("${v.id}","${v.type}", '${v.title}', '${v.question}', '${v.answer}', '${v.time}','${v.createTime}')`,
            function (error, results, fields) {
              if (error) throw error
            }
          )
        }
      })
    })
  }

  var timerFn = function () {
    console.log("发出请求，运行一次~")
    spiderHttp.getShangHaiHtml(function (list) {
      save(list)
    })
    spiderHttp.getShenZhenHtml(function (list) {
      save(list)
    })
  }
  // timerFn() // 立即执行一次
  // timer = setInterval(function () {
  //   timerFn()
  // }, webConfig.coverTime * 1000 || 30000)
}
