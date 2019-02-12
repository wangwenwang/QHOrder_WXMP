// pages/index/manageInventory/warehouseDetail/inAndOut/inAndOut.js
var utils = require("../../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadPage: 1,//下拉刷新到第几页
    isFinished: 0,//下拉加载是否完成
    Info:[],//详情列表数据
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
    
    this.setData({
      IDX: options.IDX
    })

    var data = {
      "IDX": options.IDX,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetNewStockNoList", data, this.callback)
  
  },
  "callback":function(res){

    wx.hideLoading();
    var self=this;

    console.log(res)

    if (res.type == 1) {

      if (res.result.Info.length) {
        //处理数据
        for (var i = 0; i < res.result.Info.length; i++) {
          res.result.Info[i].STOCK_QTY = parseInt(res.result.Info[i].STOCK_QTY)
        }

        // 判断是否能下拉刷新
        if (res.result.Info.length < 20) {
          self.setData({
            isFinished: 1
          })
        } else {
          self.setData({
            isFinished: 0,
          })
        }
        //上拉加载后 数据拼接
        if (self.data.loadPage > 1) {
          self.setData({
            Info: self.data.Info.concat(res.result.Info)
          })
        } else {
          self.setData({
            Info: res.result.Info
          })
        }
      }

    } else {
      self.setData({
        tagHidden: 'block',
        tagContent: res.msg
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
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
    var self=this;
    this.setData({
      loadPage: 1,
    })

    var data = {
      "IDX":self.data.IDX,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetNewStockNoList", data, this.callback);
    wx.stopPullDownRefresh();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self=this;

    if (self.data.isFinished) {

      return;

    } else {
      self.setData({
        loadPage: self.data.loadPage + 1,
      })
    }

    var data = {
      "IDX": self.data.IDX,
      "strPage": self.data.loadPage,
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetNewStockNoList", data, this.callback)
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})