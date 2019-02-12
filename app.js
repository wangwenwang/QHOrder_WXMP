//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userName:'',
    password:'',
    IDX:"29",
    USER_NAME:'凯东源测试账号',
    USER_TYPE:'PARTY',
    BUSINESS_IDX:"92",
    BUSINESS_CODE:"MYI01",
    BUSINESS_NAME:"凯东源贸易",
    putDetails:false,
    submitArr:[],//选择商品页面，购物车商品列表
    GiftClasses:[],//添加赠品页面需要的参数
    giftArr:[],//手动添加赠品后的赠品数组
    overplus: {},//品类中，赠品的剩余数量
    points:[],
    monthly:false,//每月计划 页面是否刷新
  }
  //获取全局变量   getApp().globalData.BUSINESS_IDX

})