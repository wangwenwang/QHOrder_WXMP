// pages/index/hotGoods/hotGoods.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    tagHidden: 'none',//提示信息是否出现
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })
    

    var self=this;
    var BUSINESS_IDX = getApp().globalData.BUSINESS_IDX;

    // 请求热销产品数据
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetProductList",
      method: 'POST',
      data: {
        "strBusinessId":BUSINESS_IDX,
        "strPartyIdx":"2254",
        "strPartyAddressIdx":"2254",
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();

        if (res.data.type==1){
          var result = res.data.result;

          for (var i = 0; i < res.data.result.length; i++) {

            //如果有逗号，则截取。没有逗号，则不截取
            if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
              result[i].PRODUCT_NAME = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
              result[i].PRODUCT_DESC = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
            }
          }
          self.setData({
            goodsList: res.data.result
          })
        }else{
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