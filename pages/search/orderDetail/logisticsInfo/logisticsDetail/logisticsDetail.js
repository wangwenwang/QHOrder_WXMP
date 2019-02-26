// pages/search/orderDetail/logisticsInfo/logisticsDetail/logisticsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ORD_NO: '', //订单号
    TMS_SHIPMENT_NO:'', //装运编号
    TMS_DATE_LOAD: '',//装运时间
    TMS_DATE_ISSUE: '', // 出库时间
    TMS_FLEET_NAME: '', //承运商名
    TMS_DRIVER_NAME: '',// 司机姓名
    TMS_DRIVER_TEL:'',// 司机号码
    ORD_ISSUE_QTY: '',// 下单数量
    ORD_ISSUE_WEIGHT: '',// 下单总重
    ORD_ISSUE_VOLUME: '',// 下单体积
    TMS_PLATE_NUMBER: '',// 车牌号码
    ORD_WORKFLOW: '',// 订单流程
    ORD_STATE: '',// 订单状态
    DRIVER_PAY:'',// 付款方式
    OrderDetails: [], //货物信息数组
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

    var self=this;
   
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

          var resultData = res.data.result[0].order;

          //订单流程显示信息处理
          var ORD_WORKFLOW = resultData.ORD_WORKFLOW;

          if (ORD_WORKFLOW == '新建') {

            resultData.ORD_WORKFLOW = '已接受';

          } else if (ORD_WORKFLOW == '已释放') {

            resultData.ORD_WORKFLOW = '待装车';

          } else if (ORD_WORKFLOW == '已确定') {

            resultData.ORD_WORKFLOW = '已拼车';

          } else if (ORD_WORKFLOW == '已回单') {

            resultData.ORD_WORKFLOW = '已完结';

          }
          var ORD_STATE = resultData.ORD_STATE;
          if (ORD_STATE == 'CLOSE') {

            ORD_STATE = '已完成';

          } else if (ORD_STATE == 'OPEN') {

            ORD_STATE = '在途';

          } else if (ORD_STATE == 'CANCEL') {

            ORD_STATE = '已取消';

          } else if (ORD_STATE == 'PENDING') {

            ORD_STATE = '待接收';

          }
          for (var m = 0; m < resultData.OrderDetails.length; m++) {
            resultData.OrderDetails[m].ISSUE_QTY = parseInt(resultData.OrderDetails[m].ISSUE_QTY)
          }

          self.setData({
            ORD_NO: resultData.ORD_NO, //订单号
            TMS_SHIPMENT_NO: resultData.TMS_SHIPMENT_NO, //装运编号
            TMS_DATE_LOAD: resultData.TMS_DATE_LOAD,//装运时间
            TMS_DATE_ISSUE: resultData.TMS_DATE_ISSUE, // 出库时间
            TMS_FLEET_NAME: resultData.TMS_FLEET_NAME, //承运商名
            TMS_DRIVER_NAME: resultData.TMS_DRIVER_NAME,// 司机姓名
            TMS_DRIVER_TEL: resultData.TMS_DRIVER_TEL,// 司机号码
            ORD_ISSUE_QTY: parseInt(resultData.ORD_ISSUE_QTY),// 下单数量
            ORD_ISSUE_WEIGHT: resultData.ORD_ISSUE_WEIGHT,// 下单总重
            ORD_ISSUE_VOLUME: resultData.ORD_ISSUE_VOLUME,// 下单体积
            TMS_PLATE_NUMBER: resultData.TMS_PLATE_NUMBER,// 车牌号码
            ORD_WORKFLOW: resultData.ORD_WORKFLOW,// 订单流程
            ORD_STATE: ORD_STATE,// 订单状态
            DRIVER_PAY: resultData.DRIVER_PAY,// 付款方式
            OrderDetails: resultData.OrderDetails,//货物信息数组
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