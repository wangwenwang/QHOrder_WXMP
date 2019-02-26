// pages/index/manageInventory/outWarehouseDetail/outDetails/outDetails.js
var utils = require("../../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{},
    List: [],
    isBtnHidden: 'none',
    tagContent: "", //提示信息
    tagHidden: "none", //提示信息 是否显示
    passParameter: "20",
    cancelOut:"取消出库", //取消出库 按钮显示的文字
    confirmOut: "确定出库",//确认出库 按钮显示的文字
  },
  //确认出库事件
  "confirmOut": function () {
    var self = this;

    var data = {
      "Output_idx": self.data.orderInfo.IDX,
      "ADUT_USER": getApp().globalData.USER_NAME,
        "strLicense": ''
    };

    utils.http("OutPutWorkflow", data, this.callback)
  
  },
  //确认出库和取消出库事件 请求的回调函数
  "callback":function(res){
       
    var self=this;

    self.setData({
      tagHidden: "block",
      tagContent: res.data.msg
    })
    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
      getApp().globalData.putDetails = true;
      wx.navigateBack({
        delta: 1
      })
    }, 2000)

  },
  //取消出库事件
  "cancelOut":function(){
    var self=this;

    var data = {
      "OutputIdx": self.data.orderInfo.IDX,
      "OPER_USER": getApp().globalData.USER_NAME,
      "strLicense": ''
    };

    utils.http("OutPutCancel", data, this.callback)
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;
   
    if (options.cancelOut){
      self.setData({
        cancelOut: options.cancelOut,//取消出库 按钮显示的文字
        confirmOut: options.confirmOut,//确认出库 按钮显示的文字
      })
    }
    this.setData({
      isBtnHidden: options.isPutBtn
    })
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetOupputInfo",
      method: "POST",
      data: {
        "OutputIdx": options.OutputIdx,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.type == 1) {

          var orderInfo = res.data.result.Info;
         
          orderInfo.OUTPUT_WEIGHT = Math.round(orderInfo.OUTPUT_WEIGHT * 100) / 100;
          orderInfo.OUTPUT_VOLUME = Math.round(orderInfo.OUTPUT_VOLUME * 100) / 100;

          if (res.data.result.List.length){

            var goodsList = res.data.result.List;

            for (var i = 0; i < res.data.result.List.length; i++) {
              goodsList[i].OUTPUT_QTY = parseInt(goodsList[i].OUTPUT_QTY);
              goodsList[i].ORG_PRICE = parseInt(goodsList[i].ORG_PRICE);
              goodsList[i].SUM = parseInt(goodsList[i].SUM);
            }
            self.setData({
              List: res.data.result.List,
            })
          }
          self.setData({
            orderInfo: orderInfo
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