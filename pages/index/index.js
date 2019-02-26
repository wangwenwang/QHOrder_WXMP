// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inventoryHidden: "block",//库存登记 是否隐藏
    costBillHidden: "block",//费用账单 是否隐藏
    swiperImg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;

    var BUSINESS_CODE = getApp().globalData.BUSINESS_CODE;

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

  },
  //查看报表
  "toReport": function () {
    wx.navigateTo({
      url: 'viewReport/viewReport'
    })
  },
  //查看订单
  "searchOrder": function () {
    wx.switchTab({
      url: '../search/search'
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