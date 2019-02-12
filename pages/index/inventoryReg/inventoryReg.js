// pages/index/inventoryReg/inventoryReg.js
var utils = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    hasData: false,//您还没有库存登记  提示是否出现
    loadPage: 1,//下拉刷新到第几页
    isFinished: 0,//下拉加载是否完成
    tagHidden: "none",//提示信息是否显示
    tagContent: "",//提示信息内容
  
  },
  //跳转到 客户列表 页面
  "customerList":function(){

   var self=this;

    self.setData({
      tagHidden: 'block',
      tagContent: '维护中...'
    })
    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)

    // wx.navigateTo({
    //   url: 'customerList/customerList?inventoryReg=inventoryReg'
    // })
  },
  "inventoryDetail":function(e){
   
    wx.navigateTo({
      url: 'inventoryDetail/inventoryDetail?StockIdx=' + this.data.listData[e.currentTarget.id].IDX
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })
   
    var data = {
      "UserName": getApp().globalData.userName,
      "strPage": "1",
      "strPageCount": "20",
      "strUserId": getApp().globalData.IDX,
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strLicense": ''
    };

    utils.http("GetStockList1", data, this.callback)
  },
  "callback":function(res){

    wx.hideLoading();

    var self=this;

    if (res.result.Stock.length) {

      var Stock = res.result.Stock;

      for (var i = 0; i < Stock.length; i++) {

        Stock[i].SUBMIT_DATE = Stock[i].SUBMIT_DATE.substring(0, Stock[i].SUBMIT_DATE.indexOf(' '));
      }

      // 判断是否能下拉刷新
      if (res.result.Stock.length < 20) {
        self.setData({
          isFinished: 1
        })
      } else {
        self.setData({
          isFinished: 0,
        })
      }
      //判断列表数组  加载后是否需要连接
      if (self.data.loadPage > 1) {
        self.setData({
          listData: self.data.listData.concat(Stock)
        })
      } else {
        self.setData({
          listData: Stock
        })
      }
    }else{
      self.setData({
        hasData: true
      })
    }
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
    this.setData({
      loadPage: 1,
    })

    var data = {
      "UserName": getApp().globalData.userName,
      "strPage": "1",
      "strPageCount": "20",
      "strUserId": getApp().globalData.IDX,
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strLicense": ''
    };

    utils.http("GetStockList1", data, this.callback);
    wx.stopPullDownRefresh();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var self = this;

    if (self.data.isFinished) {

      return;

    } else {
      self.setData({
        loadPage: self.data.loadPage + 1,
      })
    }

    var data = {
      "UserName": getApp().globalData.userName,
      "strPage": self.data.loadPage,
      "strPageCount": "20",
      "strUserId": getApp().globalData.IDX,
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strLicense": ''
    };

    utils.http("GetStockList1", data, this.callback)
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})