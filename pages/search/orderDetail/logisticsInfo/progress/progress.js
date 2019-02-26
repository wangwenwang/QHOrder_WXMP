// pages/search/orderDetail/logisticsInfo/progress/progress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData:[],
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
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
  
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetOrderTmsOrderNoInfo",
      method: "POST",
      data: {
        "strTmsOrderId": options.TmsList,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if(res.data.type==1){

          var resultData = res.data.result[0].order.StateTack;

          for (var i = 0; i < resultData.length; i++) {
            if (resultData[i].ORDER_STATE == '新建') {

              resultData[i].ORDER_STATE = '已接收';

            } else if (resultData[i].ORDER_STATE == '已释放') {

              resultData[i].ORDER_STATE = '待装车';

            } else if (resultData[i].ORDER_STATE == '已确认') {

              resultData[i].ORDER_STATE = '已拼车';

            } else if (resultData[i].ORDER_STATE == '已回单') {

              resultData[i].ORDER_STATE = '已完结';
            }
          }

          self.setData({
            resultData: resultData
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