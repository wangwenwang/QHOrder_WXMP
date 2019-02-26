// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    USER_NAME:"",
    BUSINESS_NAME:'',
    USER_TYPE:'',
    tempFilePaths:"../../lib/image/ic_person@2x.png"
  },
  "toAbout":function(){
    wx.navigateTo({
      url: 'about/about'
    })
  },
  "toRepswd":function(){
    wx.navigateTo({
      url: 'rePassword/rePassword'
    })
  },
  //打开二维码页面
  "toScan":function(){
    wx.navigateTo({
      url: 'scan/scan'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   var global= getApp().globalData;

   var USER_TYPE='';

  // 判断用户角色
   if (global.USER_TYPE =='PARTY'){
     USER_TYPE='客户';
   } else if (global.USER_TYPE == 'PARGANA'){
     USER_TYPE = '大区';
   } else if (global.USER_TYPE == 'BUSINESS'){
     USER_TYPE = '业务员';
   } else if (global.USER_TYPE == 'ADMIN'){
     USER_TYPE = '管理员';
   }

   this.setData({
     USER_NAME: getApp().globalData.USER_NAME,
     BUSINESS_NAME: getApp().globalData.BUSINESS_NAME,
     USER_TYPE: USER_TYPE
   })
  
  },
  "toggleUser":function(){
    wx.redirectTo({
      url: '../login/login'
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