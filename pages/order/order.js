// pages/order/order.js
var utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData:[],
    reData:[],//搜索结果
    seleHidden:'none',
    selectAddress:[],
    orderNum:0,
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
    loadPage: 1,
    isFinished: 0,
    nowPage:1,//当前第几页
    nowPageHide:false,//分页按钮是否显示
  },
  //搜索功能
  "search": function (e) {

    var listData = this.data.resultData;
    var reData = [];
    for (var i = 0; i < listData.length; i++) {

      if (listData[i].PARTY_NAME.indexOf(e.detail.value) != -1) {

        reData[reData.length] = listData[i];
      }
    }
    this.setData({
      reData: reData
    })
  },
  "toGoods":function(e){
    var self=this;
    wx.navigateTo({
      url: 'selectGoods/selectGoods?strPartyIdx=' + self.data.reData[self.data.orderNum].IDX + '&strPartyAddressIdx=' + self.data.selectAddress[e.currentTarget.id].IDX + '&PARTY_NAME=' + self.data.reData[self.data.orderNum].PARTY_NAME + '&CONTACT_PERSON=' + self.data.selectAddress[e.currentTarget.id].CONTACT_PERSON + '&CONTACT_TEL=' + self.data.selectAddress[e.currentTarget.id].CONTACT_TEL + '&ADDRESS_INFO=' + self.data.selectAddress[e.currentTarget.id].ADDRESS_INFO + "&ADDRESS_CODE=" + self.data.selectAddress[e.currentTarget.id].ADDRESS_CODE + "&requestUrl=GetProductListType"
    })
    this.setData({
      seleHidden: 'none'
    })
  },
  "hidden":function(){
    this.setData({
      seleHidden:'none'
    })
  },
  "toSelectGoods":function(e){

    var self = this;

    var IDX = getApp().globalData.IDX;

    self.setData({
      orderNum: e.currentTarget.id
    })

    console.log(self.data.reData[e.currentTarget.id].IDX)
    console.log(IDX)
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetAddress",
      method: "POST",
      data: {
        "strPartyId": self.data.reData[e.currentTarget.id].IDX,
        "strUserId": IDX,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        console.log(res)

        if (res.data.result.length > 1) {

          self.setData({
            seleHidden: 'block',
            selectAddress: res.data.result
          })

        } else {
          wx.navigateTo({
            url: 'selectGoods/selectGoods?strPartyIdx=' + self.data.reData[e.currentTarget.id].IDX + '&strPartyAddressIdx=' + res.data.result[0].IDX + '&PARTY_NAME=' + self.data.reData[e.currentTarget.id].PARTY_NAME + '&CONTACT_PERSON=' + res.data.result[0].CONTACT_PERSON + '&CONTACT_TEL=' + res.data.result[0].CONTACT_TEL + '&ADDRESS_INFO=' + res.data.result[0].ADDRESS_INFO + "&ADDRESS_CODE=" + res.data.result[0].ADDRESS_CODE + "&requestUrl=GetProductListType"    
          })

        }
      }
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

    var self = this;

    var data = {
      "strPage": "1",
      "strPageCount": "1500",
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    utils.http("GetPartyPageList", data, this.callback)
  },
  callback:function(res){

    var self = this;

    wx.hideLoading();

    console.log(res)

    if (res.type == 1) {

      self.setData({
        resultData: res.result,
        reData: res.result
      })

      // 判断是否能按下一页按钮
      if (res.result.length < 1500) {
        self.setData({
          isFinished: 1
        })
      } else {
        self.setData({
          isFinished: 0,
          nowPageHide:true
        })
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
    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    this.setData({
      loadPage: 1,
      nowPage:  1,
    })

    var data = {
      "strPage": "1",
      "strPageCount": "1500",
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    utils.http("GetPartyPageList", data, this.callback)
    wx.stopPullDownRefresh();
  },
  // 上一页
  toPrev:function(){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    if (self.data.loadPage <= 1) {
      wx.hideLoading();
      return;
    } else {
      self.setData({
        loadPage: self.data.loadPage - 1,
        nowPage: self.data.nowPage - 1,
      })
    }

    var data = {
      "strPage": self.data.loadPage,
      "strPageCount": "1500",
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    utils.http("GetPartyPageList", data, this.callback)

  },
  // 下一页
  toNext:function(){
    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    if (self.data.isFinished) {
      wx.hideLoading();
      return;
    } else {
      self.setData({
        loadPage: self.data.loadPage + 1,
        nowPage: self.data.nowPage + 1,
      })
    }

    var data = {
      "strPage": self.data.loadPage,
      "strPageCount": "1500",
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    utils.http("GetPartyPageList", data, this.callback)
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