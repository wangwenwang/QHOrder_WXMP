// pages/index/inventoryReg/inventoryDetail/inventoryDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AppStock:[],
    Stock:{},
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetAppStockList",
      method: "POST",
      data: {
        "StockIdx": options.StockIdx,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if(res.data.type==1){
          var Stock = res.data.result.Stock;
          Stock.SUBMIT_DATE = Stock.SUBMIT_DATE.substring(0, Stock.SUBMIT_DATE.indexOf(' '));

          self.setData({
            Stock: Stock,
            AppStock: res.data.result.AppStock
          })
        } else {
          self.setData({
            tagHidden: 'block',
            tagContent: res.data.msg
          })
          setTimeout(function () {
            self.setData({
              tagHidden: 'none'
            })
          }, 2000)
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