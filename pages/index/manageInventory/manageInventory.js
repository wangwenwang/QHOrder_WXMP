// pages/index/manageInventory/manageInventory.js
var utils = require("../../../utils/util.js");
Page({
  /*
  options配置如下（由上一页路由传递而来）
  options={
      ADDRESS_CODE:"CSKF",
      ADDRESS_IDX:"71394",
      ADDRESS_INFO:"广东省深圳市龙华区民治街道328号",
      CONTACT_PERSON:"1",
      PARTY_CITY:"深圳市",
      PARTY_CODE:"CSKF",
      PARTY_NAME:"凯东源测试客户",
      PARTY_TYPE:"",
      strPartyIdx:"undefined"
  }
  */
  /**
   * 页面的初始数据
   */
  data: {
    nullHidden:"none",
    goodsList:[],
    PARTY_TYPE: '', //客户类型
    PARTY_CODE: '', //客户代码
    PARTY_CITY: '', //客户城市
    PARTY_NAME: '', //客户名称
    CONTACT_PERSON: '', //联系人名
    ADDRESS_CODE: '', //地址代码
    ADDRESS_INFO: '', //地址详情
    ADDRESS_IDX: '',
    tagHidden:"none",//提示信息是否显示
    tagContent:"",//提示信息
    loadPage: 1,//下拉刷新到第几页
    isFinished: 0,//下拉加载是否完成
  },
  //跳转到入库明细页面
  "putWarehouseDetail":function(){
    wx.navigateTo({
      url: 'putWarehouseDetail/putWarehouseDetail?ADDRESS_IDX=' + this.data.ADDRESS_IDX
    })
  },

  //入库退货    跳转到选择商品页面
  "putReturn":function(){
    // wx.navigateTo({
    //   url: '../../order/selectGoods/selectGoods?strPartyAddressIdx=' + this.data.ADDRESS_IDX + "&requestUrl=GetOutProductList" + "&PARTY_NAME=" + this.data.PARTY_NAME + "&CONTACT_PERSON=" + this.data.CONTACT_PERSON + "&ADDRESS_INFO=" + this.data.ADDRESS_INFO + "&ADDRESS_CODE=" + this.data.ADDRESS_CODE + "&strPartyIdx=" + this.data.strPartyIdx
    // })

    var self = this;
    this.setData({
      tagHidden: "block",
      tagContent: "维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)

  },
  //盘点       
  "check":function(){
    var self = this;
    this.setData({
      tagHidden:"block",
      tagContent:"维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)

  },
  //其他入库    跳转到选择商品页面
  "elseInput":function(){
    var self = this;
    this.setData({
      tagHidden: "block",
      tagContent: "维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)
  },
  //出库明细    和入库明细差不多
  "outWarehouseDetail":function(){
    wx.navigateTo({
      url: 'outWarehouseDetail/outWarehouseDetail?ADDRESS_IDX=' + this.data.ADDRESS_IDX
    })
  },
  //销售出库    跳转到选择商品页面
  "salesOut":function(){
    var self = this;
    this.setData({
      tagHidden: "block",
      tagContent: "维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)
  },
  //出库退货    跳转到选择商品页面
  "outReturn":function(){
    var self = this;
    this.setData({
      tagHidden: "block",
      tagContent: "维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)
  },
  //其他出库    跳转到选择商品页面
  "elseOut":function(){
    var self = this;
    this.setData({
      tagHidden: "block",
      tagContent: "维护中..."
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)
  },

  // 跳转到库存详情页面
  "toWarehouseDetail":function(e){
    var self=this;
    wx.navigateTo({
      url: 'warehouseDetail/warehouseDetail?IDX=' + self.data.goodsList[e.currentTarget.id].IDX
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

    // console.log(options)

    this.setData({
      PARTY_TYPE: options.PARTY_TYPE, //客户类型
      PARTY_CODE: options.PARTY_CODE, //客户代码
      PARTY_CITY: options.PARTY_CITY, //客户城市
      PARTY_NAME: options.PARTY_NAME, //客户名称
      CONTACT_PERSON: options.CONTACT_PERSON, //联系人名
      ADDRESS_CODE: options.ADDRESS_CODE, //地址代码
      ADDRESS_INFO: options.ADDRESS_INFO, //地址详情
      ADDRESS_IDX: options.ADDRESS_IDX,
      strPartyIdx: options.strPartyIdx,
      options: options

    })

    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADDRESS_IDX": options.ADDRESS_IDX,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetPartyStockList", data, this.callback)
 
  },
  "callback":function(res){

    wx.hideLoading();
    var self = this;

    if (res.result.List.length){

     
      //处理数据
      for (var i = 0; i < res.result.List.length; i++) {
        res.result.List[i].STOCK_QTY = parseInt(res.result.List[i].STOCK_QTY)
      }

      // 判断是否能下拉刷新
      if (res.result.List.length < 20) {
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
          goodsList: self.data.goodsList.concat(res.result.List)
        })
      } else {
        self.setData({
          goodsList: res.result.List
        })
      }

    }else{
      self.setData({
        nullHidden: "block"
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

var self=this;
    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADDRESS_IDX": self.data.options.ADDRESS_IDX,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetPartyStockList", data, this.callback);
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
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADDRESS_IDX":self.data.options.ADDRESS_IDX,
      "strPage": self.data.loadPage,
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetPartyStockList", data, this.callback)
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})