// pages/index/billList/billList.js
var utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billList:[],//账单列表数据
    loadPage: 1,//下拉刷新到第几页
    isFinished: 0,//下拉加载是否完成
    tagHidden: "none",//提示信息是否出现
  },
  "toFeeList":function(e){

    wx.navigateTo({
      url: 'feeList/feeList?BILL_DATE=' + this.data.billList[e.currentTarget.id].BILL_DATE + "&PARTY_IDX=" + this.data.PARTY_IDX
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

    this.setData({
      PARTY_IDX: options.strPartyIdx
    })

    var data = {
      "strPage": 1,
      "strPageCount": "20",
      "strLicense": ''
    };

    utils.http("GetAppBillFeeList", data, this.callback)
  },
  "callback":function(res){

    wx.hideLoading();

    var self=this;
    if (res.type==1){
      if (self.data.loadPage > 1) {
        self.setData({
          billList: self.data.billList.concat(res.result.AppBillFee)
        })
      } else {
        self.setData({
          billList: res.result.AppBillFee,
        })
      }

      // 判断是否能下拉刷新
      if (res.result.AppBillFee.length < 20) {
        self.setData({
          isFinished: 1
        })
      } else {
        self.setData({
          isFinished: 0,

        })
      }

    }else{
      //提示没有数据信息（根据console.log的res数据msg判断）
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
    this.setData({
      loadPage: 1,
    })
    var data = {
      "strPage": 1,
      "strPageCount": "20",
      "strLicense": ''
    };

    utils.http("GetAppBillFeeList", data, this.callback);
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
      "strPage": self.data.loadPage,
      "strPageCount": "20",
      "strLicense": ''
    };

    utils.http("GetAppBillFeeList", data, this.callback)
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})