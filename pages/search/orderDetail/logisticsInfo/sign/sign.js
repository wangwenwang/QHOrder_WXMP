// pages/search/orderDetail/logisticsInfo/sign/sign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderSign:"/lib/image/sign.png",//订单签收图   路径
    delivery1: "/lib/image/sign.png",//交货现场图1  路径
    delivery2: "/lib/image/sign.png",//交货现场图2  路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self=this;

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetAutograph",
      method: "POST",
      data: {
        "strOrderIdx": options.ORD_IDX,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        console.log(res)

        if(res.data.type==1){

          self.setData({
            orderSign: "http://oms.kaidongyuan.com:8088/Uploadfile/" + res.data.result[0].PRODUCT_URL,//订单签收图   路径
            delivery1: "http://oms.kaidongyuan.com:8088/Uploadfile/" + res.data.result[1].PRODUCT_URL,//交货现场图1  路径
            delivery2: "http://oms.kaidongyuan.com:8088/Uploadfile/" + res.data.result[2].PRODUCT_URL,//交货现场图2  路径
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})