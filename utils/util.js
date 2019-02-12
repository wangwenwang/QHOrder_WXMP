
function http(url,data,callback){
  wx.request({
    url: "https://tms.kaidongyuan.com/api/"+ url,
    method: "POST",
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      callback(res.data)
    }
  })
}

module.exports = {
  http: http
}
