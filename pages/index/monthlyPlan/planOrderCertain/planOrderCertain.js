// pages/index/monthlyPlan/planOrderCertain/planOrderCertain.js

var utils = require("../../../../utils/util.js");

const date = new Date()
const years = []
const months = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

Page({

  /**
   * 页面的初始数据
   * 
   * 
   * strProductType: options.strProductType,//客户类型
   *    PARTY_CODE: options.PARTY_CODE,//客户代码
   *  PARTY_CITY: options.PARTY_CITY,//客户城市
   *   PARTY_NAME:  options.PARTY_NAME,//客户名称
   */
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    value: [9999, 1],
    inventoryNumber: [],
    mbHidden: "none",
    inventoryMonth: '',
    textBorder: "1px solid #F28B31",
    tagHidden: "none",//标签是否显示
    tagContent: "",//提示标签内容
    options: {},
    orderList: [],
    totalNum: 0,//总数量
    totalPrice: 0,//总金额
    REMARK_Value: '',//客户填写的备注信息内容
    //页面说明：当本页面没有得到数据时，预览页面是否还有提交按钮？等等。。
  },
  // 跳转到确认订单页面
  "toConfirmInfo": function () {



    var self = this;

    if (self.data.inventoryMonth == '') {

      self.setData({
        tagHidden: 'block',
        tagContent: "请填写订单月份"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)

    } else {
      var orderList = self.data.orderList;

      for (var i = 0; i < orderList.length; i++) {

        delete orderList[i].LotPrice;

      }

      var OrderPlanDetails = orderList;

      var orderSubmit = {
        "ACT_PRICE": 595,
        "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
        "BUSINESS_TYPE": 0,//不填
        "CONSIGNEE_REMARK": this.data.REMARK_Value,
        "ENT_IDX": 9008,//固定
        "FROM_IDX": 0,//不填
        "IDX": 0,//不填
        "MJ_PRICE": 0,//不填
        "OPERATOR_IDX": getApp().globalData.IDX,
        "ORD_NO": "",//不填
        "ORD_QTY": 15,
        "ORD_VOLUME": 179219.9,
        "ORD_WEIGHT": 110000,
        "ORG_IDX": 0,
        "ORG_PRICE": 595,
        "OrderPlanDetails": OrderPlanDetails,
        "REQUEST_DELIVERY": "1900-01-01T00:00:00",
        "REQUEST_ISSUE": this.data.year + '-' + (Array(2).join(0) + this.data.month).slice(-2) + "-26 14:56:54",
        "TO_ADDRESS": "",
        "TO_CITY": "",
        "TO_CNAME": "",
        "TO_CODE": self.data.options.ADDRESS_CODE,
        "TO_COUNTRY": "",
        "TO_CSMS": "",
        "TO_CTEL": "",
        "TO_IDX": self.data.options.TO_IDX,
        "TO_NAME": "",
        "TO_PROPERTY": "",
        "TO_PROVINCE": "",
        "TO_REGION": "",
        "TO_ZIP": ""
      }

      var data = {
        "strOrderInfo": JSON.stringify(orderSubmit),
        "strLicense": ""
      }

      // ******************************************

      // 发送请求
      // wx.request({
      //   url: "http://oms.kaidongyuan.com:8088/api/ImportToOrderPlanList",
      //   method: "POST",
      //   data: {
      //     "strOrderInfo": JSON.stringify(orderSubmit),
      //     "strLicense": ''
      //   },
      //   header: {
      //     "content-type": "application/x-www-form-urlencoded"
      //   },
      //   success: function (res) {
      //     console.log(res)
      //     if (res.data.type == 1) {

      //       self.setData({
      //         tagHidden: 'block',
      //         tagContent: res.data.msg
      //       })

      //       setTimeout(function () {
      //         self.setData({
      //           tagHidden: 'none'
      //         })

      //       getApp().globalData.monthly = true;

      //       wx.navigateBack({
      //         delta: 3
      //       })
      //       }, 2000)

      //     } else {

      //       self.setData({
      //         tagHidden: 'block',
      //         tagContent: res.data.msg
      //       })
      //       setTimeout(function () {
      //         self.setData({
      //           tagHidden: 'none'
      //         })
      //       }, 2000)
      //     }

      //   }
      // })

      //******************************************** */

      //发送请求商品列表
      utils.http("ImportToOrderPlanList", data,  this.submitCallback);

    }


  },
  "submitCallback": function (res) {

    var self=this;
    console.log(res)
    if (res.type == 1) {

      self.setData({
        tagHidden: 'block',
        tagContent: res.msg
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
    
        getApp().globalData.monthly = true;

        wx.navigateBack({
          delta: 3
        })

      }, 2000)

    } else {

      self.setData({
        tagHidden: 'block',
        tagContent: res.msg
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
    }
  },
  //日期选择器  点击事件
  "monthSelect": function () {

    this.setData({
      mbHidden: "block",
    })
  },
  //日期选择器  取消按钮
  "cancel": function () {
    this.setData({
      mbHidden: 'none',
    })
  },
  //日期选择器  确定按钮
  "ensure": function () {
    var self = this;

    this.setData({
      mbHidden: "none",
      textBorder: "none",
      inventoryMonth: self.data.year + "年" + self.data.month + "月"
    })

    if (self.data.val) {
      self.setData({
        year: self.data.years[self.data.val[0]],
        month: self.data.months[self.data.val[1]],
        inventoryMonth: self.data.years[self.data.val[0]] + "年" + self.data.months[self.data.val[1]] + "月",
      })
    }
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      val: val
    })
  },
  //填写备注信息  bindinput事件
  "CONSIGNEE_REMARK": function (e) {
    this.setData({
      REMARK_Value: e.detail.value,//客户填写的备注信息内容
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

    getApp().globalData.giftArr = [];

    var submitArr = getApp().globalData.submitArr;

    var BUSINESS_IDX = getApp().globalData.BUSINESS_IDX;

    var totalNum = 0, totalPrice = 0;

    for (var j = 0; j < submitArr.length; j++) {

      submitArr[j].totalPrice = submitArr[j].number * submitArr[j].PRODUCT_PRICE;

      totalNum += submitArr[j].number;
      totalPrice += parseFloat(submitArr[j].PRODUCT_PRICE * submitArr[j].number);
    }

    this.setData({
      options: options,
      submitArr: submitArr,
      totalNum: totalNum,
      totalPrice: totalPrice
    })

    var OrderDetails = [];

    for (var i = 0; i < submitArr.length; i++) {

      OrderDetails[i] = {
        "ACT_PRICE": submitArr[i].ACT_PRICE,//判断
        "ENT_IDX": 9008, //固定
        "IDX": 0,//不填
        "LINE_NO": i + 1, //顺序增长
        "LOTTABLE06": "N",  //默认
        "LOTTABLE10": submitArr[i].PRODUCT_TYPE,   //PRODUCT_TYPE
        "LOTTABLE11": 0,   //默认
        "LOTTABLE12": 0,  //默认
        "LOTTABLE13": 0,  //默认
        "MJ_PRICE": 0, // 固定
        "OPERATOR_IDX": getApp().globalData.IDX, //操作者IDX，也就是登录用户的ID
        "ORDER_IDX": 0, //不填
        "ORG_PRICE": submitArr[i].PRODUCT_PRICE,
        "PO_QTY": submitArr[i].number,
        "PO_VOLUME": submitArr[i].PRODUCT_VOLUME,
        "PO_WEIGHT": submitArr[i].PRODUCT_WEIGHT,
        "PRODUCT_IDX": submitArr[i].IDX,
        "PRODUCT_NAME": submitArr[i].PRODUCT_NAME,
        "PRODUCT_NO": submitArr[i].PRODUCT_NO,
        "PRODUCT_TYPE": "NR",  //产品类型默认NR，
        "PRODUCT_URL": "" //不填
      }
    }

    var submitString = {
      "ACT_PRICE": 0,//不填
      "BUSINESS_IDX": BUSINESS_IDX,
      "BUSINESS_TYPE": 0, //不填
      "ENT_IDX": 9008, //固定
      "FROM_IDX": 0, //不填
      "IDX": 0,  //不填
      "MJ_PRICE": 0, //不填
      "OPERATOR_IDX": getApp().globalData.IDX,
      "ORG_IDX": 0,//不填
      "ORG_PRICE": 0,//不填
      "OrderDetails": OrderDetails,
      "PARTY_IDX": options.strPartyIdx,
      "PAYMENT_TYPE": "FPAD",
      "TOTAL_QTY": 0, //不填
      "TOTAL_VOLUME": 0, //不填
      "TOTAL_WEIGHT": 0, //不填
      "TO_CODE": options.ADDRESS_CODE,
      "TO_IDX": options.TO_IDX
    }

    var data = {
      "strOrderInfo": JSON.stringify(submitString),
      "strLicense": ""
    }
    utils.http("SubmitOrder1", data, this.callback)
  },
  "callback": function (res) {

    wx.hideLoading();

    var self = this;

    if (res.type == 1) {

      var orderSubmit = res.result;
      var OrderDetails = res.result.OrderDetails; //订单列表（可能包含礼品）
      var orderList = [], GiftClasses = [];

      //判断是否有赠品
      for (var i = 0; i < OrderDetails.length; i++) {

        if (OrderDetails[i].PRODUCT_TYPE == "NR") {
          //为正常下的订单
          orderList[orderList.length] = OrderDetails[i];

        }
      }

      console.log(orderList)
      self.setData({
        orderList: orderList,//订单信息列表
        GiftClasses: GiftClasses,//赠品列表
        TOTAL_QTY: res.result.TOTAL_QTY,//总数
        ORG_PRICE: res.result.ORG_PRICE,//原价
        PAYMENT_TYPE: res.result.PAYMENT_TYPE,//付款方式
        orderSubmit: orderSubmit
      })

    } else {
      self.setData({
        tagHidden: 'block',
        tagContent: res.msg
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
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

/*
{
  "ACT_PRICE":595,
  "BUSINESS_IDX":"15",
  "BUSINESS_TYPE":0,
  "CONSIGNEE_REMARK":"备注信息内容栏目……",
  "ENT_IDX":9008,
  "FROM_IDX":0,
  "IDX":0,
  "MJ_PRICE":0,
  "OPERATOR_IDX":29,
  "ORD_NO":"",
  "ORD_QTY":15,
  "ORD_VOLUME":179219.9,
  "ORD_WEIGHT":110000,
  "ORG_IDX":0,
  "ORG_PRICE":595,
  "OrderPlanDetails":[
    {
      "ACT_PRICE":39,
      "ADD_DATE":"1900-01-01T00:00:00",
      "EDIT_DATE":"1900-01-01T00:00:00",
      "ENT_IDX":9008,
      "IDX":0,
      "LINE_NO":1,
      "LOTTABLE01":"",
      "LOTTABLE02":"NR",
      "LOTTABLE03":"",
      "LOTTABLE04":"",
      "LOTTABLE05":"",
      "LOTTABLE06":"N",
      "LOTTABLE07":"",
      "LOTTABLE08":"",
      "LOTTABLE09":"",
      "LOTTABLE10":"",
      "LOTTABLE11":0,
      "LOTTABLE12":0,
      "LOTTABLE13":0,
      "MJ_PRICE":0,
      "MJ_REMARK":"",
      "OPERATOR_IDX":29,
      "ORDER_IDX":0,
      "ORG_PRICE":39,
      "PO_QTY":10,
      "PO_UOM":"",
      "PO_VOLUME":79860,
      "PO_WEIGHT":60000,
      "PRODUCT_IDX":623,
      "PRODUCT_NAME":"咖啡香浓,
      180ml,1×24",
      "PRODUCT_NO":"1020016000",
      "PRODUCT_TYPE":"NR",
      "PRODUCT_URL":"",
      "SALE_REMARK":""
    },{
      "ACT_PRICE":41,
      "ADD_DATE":"1900-01-01T00:00:00",
      "EDIT_DATE":"1900-01-01T00:00:00",
      "ENT_IDX":9008,
      "IDX":0,
      "LINE_NO":2,
      "LOTTABLE01":"",
      "LOTTABLE02":"NR",
      "LOTTABLE03":"",
      "LOTTABLE04":"",
      "LOTTABLE05":"",
      "LOTTABLE06":"N",
      "LOTTABLE07":"",
      "LOTTABLE08":"",
      "LOTTABLE09":"",
      "LOTTABLE10":"",
      "LOTTABLE11":0,
      "LOTTABLE12":0,
      "LOTTABLE13":0,
      "MJ_PRICE":0,
      "MJ_REMARK":"",
      "OPERATOR_IDX":29,
      "ORDER_IDX":0,
      "ORG_PRICE":41,
      "PO_QTY":5,
      "PO_UOM":"",
      "PO_VOLUME":99359.9,
      "PO_WEIGHT":50000,
      "PRODUCT_IDX":630,
      "PRODUCT_NAME":"火咖意式拿铁咖啡350ml×24,
      350ml,1×24",
      "PRODUCT_NO":"1020049000",
      "PRODUCT_TYPE":"NR",
      "PRODUCT_URL":"",
      "SALE_REMARK":""
    }
  ],
  "REQUEST_DELIVERY":"1900-01-01T00:00:00",
  "REQUEST_ISSUE":"2018-03-26 14:56:54",
  "TO_ADDRESS":"",
  "TO_CITY":"",
  "TO_CNAME":"",
  "TO_CODE":"CSKF",
  "TO_COUNTRY":"",
  "TO_CSMS":"",
  "TO_CTEL":"",
  "TO_IDX":71394,
  "TO_NAME":"",
  "TO_PROPERTY":"",
  "TO_PROVINCE":"",
  "TO_REGION":"",
  "TO_ZIP":""
}

*/