// pages/search/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    strOrderId:'',
    haveGift:0, //0为无赠品 ， 1 为有赠品
    goodsList:[], //货物信息列表
    giftList:[],//赠品信息列表
    ORD_NO:'', //订单号
    ORD_DATE_ADD:'',  //创建时间
    ORD_TO_NAME:'', //客户名称
    ORD_TO_ADDRESS:'', //客户地址
    ORD_FROM_NAME:'',//起始地址
    ORD_QTY:'',   //下单数量
    ORD_WEIGHT:'',  //下单总量
    ORD_VOLUME:'', //下单体积
    ORD_WORKFLOW:'', //订单流程
    ORD_STATE:'', //订单状态
    PAYMENT_TYPE:'',  //付款方式
    ACT_PRICE:'',  //现价
    MJ_PRICE:'', //满减价
    MJ_info:'', //满减信息
    ORD_REMARK_CONSIGNEE:'', //备注
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
  },

  "toLogistics":function(e){
    wx.navigateTo({
      url: 'logisticsInfo/logisticsInfo?strOrderId=' + this.data.strOrderId
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

    this.setData({
      strOrderId: options.strOrderId
    })

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetOrderDetail",
      method: "POST",
      data: {
        "strOrderId": options.strOrderId,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        console.log(res)

        wx.hideLoading();
  
        if(res.data.type==1){

          var resultData = res.data.result[0].order;

          //下单数量，保留一位小数处理
          var ORD_QTY = parseFloat(resultData.ORD_QTY).toFixed(1);

          var ORD_STATE = resultData.ORD_STATE;

          //订单状态判断
          if (ORD_STATE == "PENDING") {

            ORD_STATE = "待接收";

          } else if (ORD_STATE == "CANCEL") {

            ORD_STATE = "已取消";

          } else if (ORD_STATE == "OPEN") {

            ORD_STATE = "在途";

          } else if (ORD_STATE == "CLOSE") {

            ORD_STATE = "已完成";
          }

          //付款方式，判断文字信息
          var PAYMENT_TYPE = resultData.PAYMENT_TYPE;

          if (PAYMENT_TYPE == 'FPAD') {

            PAYMENT_TYPE = "预付"

          } else if (PAYMENT_TYPE == 'FDAP') {

            PAYMENT_TYPE = "到付"

          } else if (PAYMENT_TYPE == 'MP') {

            PAYMENT_TYPE = "月结"

          } else if (PAYMENT_TYPE == 'DJ') {

            PAYMENT_TYPE = "未知"

          }
          var totalPrice;
          for (var i = 0; i < resultData.OrderDetails.length; i++) {

            //处理货物数量
            resultData.OrderDetails[i].ISSUE_QTY = parseFloat(resultData.OrderDetails[i].ISSUE_QTY).toFixed(1);

            //处理原价
            resultData.OrderDetails[i].ORG_PRICE = parseFloat(resultData.OrderDetails[i].ORG_PRICE).toFixed(1);

            //处理付款价
            resultData.OrderDetails[i].ACT_PRICE = parseFloat(resultData.OrderDetails[i].ACT_PRICE).toFixed(1);

            //在数组中添加上总价
            totalPrice = parseFloat(resultData.OrderDetails[i].ISSUE_QTY) * parseFloat(resultData.OrderDetails[i].ACT_PRICE);

            resultData.OrderDetails[i].totalPrice = totalPrice.toFixed(1);

            // 如果有赠品信息
            if (resultData.OrderDetails[i].PRODUCT_TYPE == "NR") {

              self.setData({
                goodsList: self.data.goodsList.concat(resultData.OrderDetails[i])
              })

            } else {
              self.setData({
                haveGift: 1,
                giftList: self.data.giftList.concat(resultData.OrderDetails[i])
              })
            }
          }

          //处理满减提示信息
          var MJ_info;
          if (parseFloat(resultData.MJ_PRICE)) {
            MJ_info = '-¥' + parseFloat(resultData.MJ_PRICE).toFixed(1) 
          } else {
            MJ_info = '无'
          }

          self.setData({
            ORD_NO: resultData.ORD_NO,
            ORD_DATE_ADD: resultData.ORD_DATE_ADD,
            ORD_TO_NAME: resultData.ORD_TO_NAME,
            ORD_TO_ADDRESS: resultData.ORD_TO_ADDRESS,
            ORD_FROM_NAME: resultData.ORD_FROM_NAME,
            ORD_QTY: ORD_QTY,
            ORD_WEIGHT: resultData.ORD_WEIGHT,
            ORD_VOLUME: resultData.ORD_VOLUME,
            ORD_WORKFLOW: resultData.ORD_WORKFLOW,
            ORD_STATE: ORD_STATE,
            PAYMENT_TYPE: PAYMENT_TYPE,
            ACT_PRICE: parseFloat(resultData.ACT_PRICE).toFixed(1),
            MJ_PRICE: parseFloat(resultData.MJ_PRICE).toFixed(1),
            MJ_info: MJ_info,
            ORD_REMARK_CONSIGNEE: resultData.ORD_REMARK_CONSIGNEE ? resultData.ORD_REMARK_CONSIGNEE : '无'
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