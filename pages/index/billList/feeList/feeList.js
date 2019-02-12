// pages/index/billList/feeList/feeList.js
Page({
  /**
   * 页面的初始数据
   * 
   *        PARTY_CODE: result.PARTY_CODE, // 客户代码
            PARTY_NAME: result.PARTY_NAME, //客户名称
            BUSINESS_CODE: result.BUSINESS_CODE, //业务代码
            BUSINESS_NAME: result.BUSINESS_NAME, //业务名称
            LastMonth: result.LastMonth, // 上月留存提货余额
            ThisMonthPostive: result.ThisMonthPostive, //加本月累计付款及代垫费用金额
            ThisMonthMinus: result.ThisMonthMinus, //减本月累计提货总额
            ThisMonth: result.ThisMonth, //本月留存提货余额
   */
  data: {
    AppBusinessFeeList:[],//明细列表
    result:{},
    MONTH_DATE:'', //月份
    detailNotice:'展开明细', 
    detailHidden:'none',
    animationData: {}
  },
  //展开明细
  "deployDetail":function(){
    var self = this;
    var animation = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
  
    if (this.data.detailNotice=="展开明细"){

      self.setData({
        detailNotice:"收起明细",
        detailHidden:"block"
      })
      
      animation.rotate(180).step()

    } else if (this.data.detailNotice == "收起明细"){

      self.setData({
        detailNotice: "展开明细",
        detailHidden: "none"
      })

      animation.rotate(-0).step()
    }
    this.setData({
      animationData: animation.export()
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
    

    var BUSINESS_IDX = getApp().globalData.BUSINESS_IDX;

    var self=this;

    self.setData({
      MONTH_DATE: options.BILL_DATE
    })

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetAppBusinessFeeList",
      method: "POST",
      data: {
        "BUSINESS_IDX": BUSINESS_IDX,
        "MONTH_DATE": options.BILL_DATE,
        "PARTY_IDX": options.PARTY_IDX,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();
      
        if (res.data.type == 1) {

          var result = res.data.result.AppBusinessFee;

          if (res.data.result.AppBusinessFeeList.length) {
            self.setData({
              AppBusinessFeeList: res.data.result.AppBusinessFeeList
            })
          }
          self.setData({
            result: result,
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