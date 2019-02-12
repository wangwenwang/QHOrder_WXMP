// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inventoryHidden: "block",//库存登记 是否隐藏
    costBillHidden: "block",//费用账单 是否隐藏
    manageInventoryHidden: "block",//库存管理 是否隐藏
    swiperImg: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;

    var BUSINESS_CODE = getApp().globalData.BUSINESS_CODE;

    if ((BUSINESS_CODE.indexOf("YIB") != -1) || (BUSINESS_CODE.indexOf("QH") != -1) || (BUSINESS_CODE.indexOf("TT") != -1)) {

      self.setData({
        swiperImg: [
          { 
            "url":"../../lib/swiperImage/YIB/banner1.jpg"
          },{
            "url": "../../lib/swiperImage/YIB/banner2.jpg"
          },{
            "url": "../../lib/swiperImage/YIB/banner3.jpg"
          },{
            "url": "../../lib/swiperImage/YIB/banner4.jpg"
          }
          ]
      })

    } else if (BUSINESS_CODE.indexOf("DK") != -1) {

      self.setData({
        swiperImg: [
          {
            "url": "../../lib/swiperImage/DK/banner1.png"
          }, {
            "url": "../../lib/swiperImage/DK/banner2.png"
          }, {
            "url": "../../lib/swiperImage/DK/banner3.png"
          }, {
            "url": "../../lib/swiperImage/DK/banner4.png"
          }
        ]
      })
    } else if (BUSINESS_CODE.indexOf("MY") != -1) {
      self.setData({
        swiperImg: [
          {
            "url": "../../lib/swiperImage/MY/banner1.png"
          }
        ]
      })
    }else{

    }


  },
  //跳转到每月计划页面
  "toMonthlyPlan": function () {
    wx.navigateTo({
      url: 'monthlyPlan/monthlyPlan'
    })
  },
  //跳转到库存登记页面
  "toInventory": function () {
    wx.navigateTo({
      url: 'inventoryReg/inventoryReg'
    })
  },
  //查看报表
  "toReport": function () {
    wx.navigateTo({
      url: 'viewReport/viewReport'
    })
  },
  //最新资讯
  "toNews": function () {
    wx.navigateTo({
      url: 'news/news'
    })
  },
  //热销产品
  "toHot": function () {
    wx.navigateTo({
      url: 'hotGoods/hotGoods'
    })
  },
  //查看订单
  "searchOrder": function () {
    wx.switchTab({
      url: '../search/search'
    })
  },
  //费用账单
  "costBill": function () {
    wx.navigateTo({
      url: 'inventoryReg/customerList/customerList?costBill=costBill'
    })
  },
  //库存管理
  "manageInventory": function () {
    wx.navigateTo({
      url: 'inventoryReg/customerList/customerList?manageInventory=manageInventory'
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