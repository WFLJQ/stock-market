var spiderHttp = require("../spider/index")
var spiderFormat = require("../spider/format")
let router = require("./router")

//所有的数据接口
router.get("/current", async (ctx) => {
  var map = {
    shanghai: false,
    shanghList: [],
    shenzhen: false,
    shenzhenList: [],
  }
  var all = function () {
    if (map.shenzhen && map.shanghai) {
      var html = spiderFormat.renderList(map.shenzhenList.concat(map.shanghList), false, "上证+深交")
      res.send(html)
    }
  }
  spiderHttp.getShangHaiHtml(function (list) {
    map.shanghai = true
    map.shanghList = list
    all()
  })
  spiderHttp.getShenZhenHtml(function (list) {
    map.shenzhen = true
    map.shenzhenList = list
    all()
  })

  ctx.body = {
    data: [],
  }
})

//上海的数据接口
router.get("/ShangHai", function (req, res) {
  spiderHttp.getShangHaiHtml(function (list) {
    var html = spiderFormat.renderList(list)
    res.send(html)
  })
})

//深圳的数据接口
router.get("/ShenZhen", function (req, res) {
  spiderHttp.getShenZhenHtml(function (list) {
    var html = spiderFormat.renderList(list)
    res.send(html)
  })
})
