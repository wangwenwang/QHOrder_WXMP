// pages/search/search.js
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    isHaveData:1,
    dataState:'在途',
    selectId:'OPEN',
    loadPage:1,
    isFinished:0,
    OPEN:1,
    CLOSE:0,
    CANCEL:0
  },
  //跳转到订单详情页
  "toDetail":function(e){
    var self = this;

    wx.navigateTo({
      url: 'orderDetail/orderDetail?strOrderId=' + self.data.dataList[e.currentTarget.id].IDX
    })
  },
  "tabToggle":function(e){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      isFinished: 0,
      loadPage:1
    })
   
   //判断订单状态
    if (e.currentTarget.id =='OPEN'){
      this.setData({
        dataState:"在途",
        OPEN:1,
        CLOSE:0,
        CANCEL:0
      })
    } else if (e.currentTarget.id == 'CLOSE'){
      this.setData({
        dataState: "已完成",
        OPEN: 0,
        CLOSE: 1,
        CANCEL: 0
      })
    } else if (e.currentTarget.id == 'CANCEL'){
      this.setData({
        dataState: "已取消",
        OPEN: 0,
        CLOSE: 0,
        CANCEL: 1
      })
    }

    var self = this;

    this.setData({
      selectId: e.currentTarget.id,
  
    })

    var global = getApp().globalData;

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": self.data.selectId,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderList", data, this.callback)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self =this;

    //请求数据接口所需参数
    //"strUserId":'用户idx',
    //"strPartyType": '空',
    //"strBusinessId": ' 业务代码idx',
    //"strPartyId": '空',
    //"strStartDate": '空',
    //"strEndDate": '空',
    //"strState": 'OPEN',
    //"strPage": '第几页',
    //"strPageCount": '20（一页多少条数据）',
    //"strLicense":'空'

    var data= {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": "OPEN",
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderList", data, this.callback)
  
  },
  callback:function(res){

    wx.hideLoading();

    var self = this;
  
    if (res.type==1){

      var searchData = res.result;

      var ORD_STATE;

      // 处理数据
      for (var i = 0; i < searchData.length; i++) {

        ORD_STATE = searchData[i].ORD_STATE;

        if (ORD_STATE == "PENDING") {

          searchData[i].ORD_STATE = "待接收";

        } else if (ORD_STATE == "CANCEL") {

          searchData[i].ORD_STATE = "已取消";

        } else if (ORD_STATE == "OPEN") {

          searchData[i].ORD_STATE = "在途";

        } else if (ORD_STATE == "CLOSE") {

          searchData[i].ORD_STATE = "已完成";
        }
      }

      //上拉加载后 数据拼接
      if (self.data.loadPage > 1) {
        self.setData({
          dataList: self.data.dataList.concat(res.result)
        })
      } else {
        self.setData({
          dataList: res.result
        })
      }

      // 判断是否能下拉刷新
      if (res.result.length < 20) {
        self.setData({
          isFinished: 1
        })
      } else {
        self.setData({
          isFinished: 0,
        })
      }

      //返回的数组有数据
      self.setData({
        isHaveData: 1
      })

    }else{
      //如果返回的数组为空，则没有数据
      self.setData({
        isHaveData: 0
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
  //下拉刷新
  onPullDownRefresh: function () {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    this.setData({
      loadPage: 1,
    
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": self.data.selectId,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderList", data, this.callback)
    wx.stopPullDownRefresh();
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  //上拉加载
  onReachBottom: function () {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    if (self.data.isFinished){
      wx.hideLoading();
      return;
    }else{
      self.setData({
        loadPage: self.data.loadPage + 1,
      
      })
    }
    var global = getApp().globalData;

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": self.data.selectId,
      "strPage": self.data.loadPage,
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderList", data, this.callback)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})