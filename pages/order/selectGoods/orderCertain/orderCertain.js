// pages/order/selectGoods/orderCertain/orderCertain.js
var utils = require("../../../../utils/util.js");
const date = new Date();
const years = [];
const months = [];
const days = [];

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据TOTAL_QTY
   */
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth()+1,
    days: days,
    day: date.getDate(),
    value: [date.getFullYear(), date.getMonth(), date.getDate()-1],
    mbHidden: "none",//日期选择器是否显示
    submitArr: [],//
    orderList: [],//订单信息列表
    GiftClasses: [],//所有赠品信息列表
    orgiGiftClass: [],//送的赠品信息列表
    tagContent: '',//提示信息内容
    tagHidden: "none",//提示信息是否显示
    noneGift: 'block',//无赠品 显示否
    MJ_hidden: "none",//满减策略信息 是否显示
    pay_typeInfo: '',
    addGift: "添加赠品",//添加赠品按钮中显示的文字
    addGift_hidden: "none",//添加赠品按钮 是否显示
    strProductType: '', //赠品类型 
    TO_IDX: '',//地址idx
    strPartyIdx: '',
    giftNone: "block",
    textareaHidden: "block",//备注信息输入框是否显示
    REMARK_Value: '',//客户填写的备注信息内容
    haveDate:false,
    dateSelect:"none",
    priceReg:[],//是否有单价策略调整
    regNumber: [],//有单价策略调整时，现价价格
    isHidden: "none",//有单价策略调整时，调整弹出框是否显示
    inputValue: '',//有单价策略调整时，调整弹出框的值
    inputNum: 0,//有单价策略调整时，调整产品的idx
    
  },
  //最终提交订单  确认按钮 点击事件
  "orderSubmit": function () {
    var self = this;
    var orderSubmit = this.data.orderSubmit;

    var giftArr = getApp().globalData.giftArr;

    var orderList = this.data.orderList;
    console.log(giftArr)

    //orderSubmit.GiftClasses的值
    var giftSubmit = [], GiftClasses = getApp().globalData.GiftClasses;

    //orderSubmit.GiftClasses数据形式
    // [{ "checked": false, "choiceCount": 0, "pRICE": 0, "qTY": 16, "tYPE_NAME": "茶派系列" }]

    // //客户手动添加了赠品   
    if (giftArr.length) {

      var checked = true;

    } else {

      var checked = false;
    }

    for (var i = 0; i < GiftClasses.length; i++) {

      giftSubmit[i] = {
        "checked": checked,
        "choiceCount": GiftClasses[i].QTY - getApp().globalData.overplus[GiftClasses[i].TYPE_NAME],
        "pRICE": 0,
        "qTY": GiftClasses[i].QTY,
        "tYPE_NAME": GiftClasses[i].TYPE_NAME
      };

    }

    var OrderDetails=[];
    //最后提交的数组中  正常添加的商品
    for (var m = 0; m < orderList.length; m++) {
      OrderDetails[m] = {
        "OPERATOR_IDX": getApp().globalData.IDX, //操作者IDX，也就是登录用户的ID,
        "LOTTABLE07": "",//
        "ORDER_IDX": 0,//
        "LOTTABLE12": 0,//
        "ORG_PRICE": orderList[m].ORG_PRICE,
        "PRODUCT_URL": "",//
        "PO_WEIGHT": orderList[m].PO_WEIGHT * orderList[m].PO_QTY,
        "ADD_DATE": "1900-01-01T00:00:00",//
        "LOTTABLE05": "",//
        "IDX": 0,//
        "LOTTABLE10": orderList[m].LOTTABLE10,
        "MJ_PRICE": 0,//
        "PRODUCT_NO": orderList[m].PRODUCT_NO,
        "PRODUCT_IDX": orderList[m].PRODUCT_IDX,
        "LOTTABLE03": "",//
        "MJ_REMARK": "",//
        "EDIT_DATE": "1900-01-01T00:00:00",//
        "LOTTABLE01": "",//
        "PRODUCT_NAME": orderList[m].PRODUCT_NAME,
        "LOTTABLE08": "",//
        "LOTTABLE13": 0,//
        "LINE_NO": m+1,
        "LOTTABLE06": "N",//
        "PO_QTY": orderList[m].PO_QTY,
        "LOTTABLE11": 0,//
        "PO_VOLUME": orderList[m].PO_VOLUME,
        "LOTTABLE04": "",//
        "PO_UOM": "",//
        "ACT_PRICE": self.data.orderSubmit.OrderDetails[m].ACT_PRICE,
        "LOTTABLE02": "NR",//
        "LOTTABLE09": "",//
        "PRODUCT_TYPE": orderList[m].PRODUCT_TYPE,
        "SALE_REMARK": "",//
        "ENT_IDX": 9008//
      }
    }

    console.log(self.data.orgiGiftClass)

    console.log(giftArr)

    var orgACT_PRICE = 0;

    //最后提交的数组中  系统送的赠品
    for (var io = 0; io < self.data.orgiGiftClass.length; io++) {

      orgACT_PRICE = self.data.orgiGiftClass[io].ACT_PRICE ;

      OrderDetails[OrderDetails.length] = {
        "ACT_PRICE": orgACT_PRICE,
        "ENT_IDX": 9008,
        "IDX": 0,
        "LINE_NO": OrderDetails.length + 1,
        "LOTTABLE02": "NR",
        "LOTTABLE06": "N",
        "LOTTABLE09": "N",
        "LOTTABLE11": 0,
        "LOTTABLE12": 0,
        "LOTTABLE13": 0,
        "MJ_PRICE": 0,
        "OPERATOR_IDX": getApp().globalData.IDX,
        "ORDER_IDX": 0,
        "ORG_PRICE": self.data.orgiGiftClass[io].ORG_PRICE,
        "PO_QTY": self.data.orgiGiftClass[io].PO_QTY,
        "PO_VOLUME": self.data.orgiGiftClass[io].PO_VOLUME,
        "PO_WEIGHT": self.data.orgiGiftClass[io].PO_WEIGHT,
        "PRODUCT_IDX": self.data.orgiGiftClass[io].PRODUCT_IDX,
        "PRODUCT_NAME": self.data.orgiGiftClass[io].PRODUCT_NAME,
        "PRODUCT_NO": self.data.orgiGiftClass[io].PRODUCT_NO,
        "PRODUCT_TYPE": "GF",
        "SALE_REMARK": self.data.orgiGiftClass[io].SALE_REMARK
      }

      // orderSubmit.ORG_PRICE += parseFloat(giftArr[j].ORG_PRICE) * giftArr[j].PO_QTY;
      // orderSubmit.TOTAL_QTY += giftArr[j].PO_QTY;
      // orderSubmit.TOTAL_WEIGHT = parseFloat(orderSubmit.TOTAL_WEIGHT) + (giftArr[j].PO_QTY) * (parseFloat(giftArr[j].PRODUCT_WEIGHT));

    }

    var ACT_PRICE = 0;
    //最后提交的数组中  手动添加的赠品
    for (var j = 0; j < giftArr.length; j++) {
      
      if (giftArr[j].PRODUCT_DESC == "空瓶费") {

        ACT_PRICE = giftArr[j].ACT_PRICE;

      }else{

        ACT_PRICE = 0;
      }

      OrderDetails[OrderDetails.length] = {
        "ACT_PRICE": ACT_PRICE,
        "ENT_IDX": 9008,
        "IDX": 0,
        "LINE_NO": OrderDetails.length + 1,
        "LOTTABLE02": "NR",
        "LOTTABLE06": "N",
        "LOTTABLE09": "N",
        "LOTTABLE11": 0,
        "LOTTABLE12": 0,
        "LOTTABLE13": 0,
        "MJ_PRICE": 0,
        "OPERATOR_IDX": getApp().globalData.IDX,
        "ORDER_IDX": 0,
        "ORG_PRICE": giftArr[j].ORG_PRICE,
        "PO_QTY": giftArr[j].PO_QTY,
        "PO_VOLUME": giftArr[j].PRODUCT_VOLUME,
        "PO_WEIGHT": giftArr[j].PRODUCT_WEIGHT,
        "PRODUCT_IDX": giftArr[j].IDX,
        "PRODUCT_NAME": giftArr[j].PRODUCT_NAME,
        "PRODUCT_NO": giftArr[j].PRODUCT_NO,
        "PRODUCT_TYPE": "GF",
        "SALE_REMARK": giftArr[j].SALE_REMARK
      }

      orderSubmit.ORG_PRICE += parseFloat(giftArr[j].ORG_PRICE) * giftArr[j].PO_QTY;
      orderSubmit.TOTAL_QTY += giftArr[j].PO_QTY;
      orderSubmit.TOTAL_WEIGHT = parseFloat(orderSubmit.TOTAL_WEIGHT)+ (giftArr[j].PO_QTY) * (parseFloat(giftArr[j].PRODUCT_WEIGHT));
    
    }
 
    orderSubmit.OrderDetails = OrderDetails;

    //客户填写的备注信息
    orderSubmit.CONSIGNEE_REMARK = this.data.REMARK_Value;

    //总的实际价格
    orderSubmit.ACT_PRICE = self.data.ACT_PRICE;


    //客户选择的送货时间  "REQUEST_DELIVERY": "2019-02-08 10:18:45"
    if (self.data.haveDate){
      
      orderSubmit.REQUEST_DELIVERY = this.data.year + '-' + (Array(2).join(0) + this.data.month).slice(-2) + '-' + (Array(2).join(0) + this.data.day).slice(-2) + " 10:18:45";

    }else{
      orderSubmit.REQUEST_DELIVERY = "1900-01-01T00:00:00";
    }

    //客户手动添加的赠品（有系统赠送的赠品时。这个数组需不需要改变）
    orderSubmit.GiftClasses = giftSubmit;

    console.log(JSON.stringify(orderSubmit))
    console.log(orderSubmit)

    var data = {
      "strOrderInfo": JSON.stringify(orderSubmit),
      "strLicense": ""
    }

    utils.http("ConfirmOrder", data, this.submitCallback)

  },
  "submitCallback": function (res) {
    var self = this;
    console.log(res)

    self.setData({
      tagHidden: 'block',
      tagContent: res.msg
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })

      if (res.type == "0"){
        wx.navigateBack({
          delta: 2
        })
      }
    }, 2000)

  },
  //填写备注信息  bindinput事件
  "CONSIGNEE_REMARK": function (e) {
    this.setData({
      REMARK_Value: e.detail.value,//客户填写的备注信息内容
    })

  },
  //添加赠品按钮  跳转到添加赠品页面
  "addGift": function () {
    var self = this;

    wx.navigateTo({
      url: "addGift/addGift?strPartyAddressIdx=" + self.data.TO_IDX + "&strPartyIdx=" + self.data.strPartyIdx
    })
  },
  //日期选择器 确认按钮
  "ensure": function () {
    var self = this;

    this.setData({
      haveDate:true,
      dateSelect: "block"
    })
    if (self.data.val) {
      self.setData({
        mbHidden: "none",
        year: self.data.years[self.data.val[0]],
        month: self.data.months[self.data.val[1]],
        day: self.data.days[self.data.val[2]],
        textareaHidden: "block"
      })
    } else {
      self.setData({
        mbHidden: "none",
        textareaHidden: "block"
      })
    }

  },
  //日期选择器 取消按钮
  "cancel": function () {
    this.setData({
      mbHidden: "none",
      textareaHidden: "block"
    })
  },
  //点击 日期选择器出现
  "dateShow": function () {
    this.setData({
      mbHidden: "block",
      textareaHidden: "none",
    })
  },
  //当有单价调整策略时，减
  "jian":function(e){

    var self = this;

    var regNumber = this.data.regNumber, submitArr = self.data.submitArr, orderSubmit = self.data.orderSubmit;

    if (regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX] <= submitArr[e.currentTarget.id].PRODUCT_POLICY[0].AMOUNT_START){
      return;
    }

    //处理实际价格  
    var ACT_PRICE = (parseFloat(this.data.ACT_PRICE) * 10 - 1*submitArr[e.currentTarget.id].number) / 10;

    //改变orderSubmit里面的实际价格
    orderSubmit.OrderDetails[e.currentTarget.id].ACT_PRICE = (parseFloat(orderSubmit.OrderDetails[e.currentTarget.id].ACT_PRICE) * 10 - 1) / 10;

    regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX] = (parseFloat(regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX])*10 - 1)/10;

    this.setData({
      regNumber: regNumber,
      ACT_PRICE: ACT_PRICE,
      orderSubmit: orderSubmit
    })
  },
  //当有单价调整策略时，加
  "jia": function (e) {

    var self = this;

    var regNumber = this.data.regNumber, submitArr = self.data.submitArr, orderSubmit = self.data.orderSubmit;

    if (regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX] >= submitArr[e.currentTarget.id].PRODUCT_POLICY[0].AMOUNT_END) {
      return;
    }

    //处理实际价格  orderSubmit里面的实际价格也需要改变
    var ACT_PRICE = (parseFloat(this.data.ACT_PRICE) * 10 + 1 * submitArr[e.currentTarget.id].number) / 10;

    //改变orderSubmit里面的实际价格
    orderSubmit.OrderDetails[e.currentTarget.id].ACT_PRICE = (parseFloat(orderSubmit.OrderDetails[e.currentTarget.id].ACT_PRICE) * 10 + 1) / 10;

    regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX] = (parseFloat(regNumber[self.data.orderList[e.currentTarget.id].PRODUCT_IDX])*10 + 1)/10;

    this.setData({
      regNumber: regNumber,
      ACT_PRICE: ACT_PRICE,
      orderSubmit: orderSubmit
    })
  },
  //当有单价调整策略时点击价格  价格调整弹出框出现 
  "entryShow":function(e){
   
    this.setData({
      isHidden:"block",
      inputNum: e.currentTarget.id,//点击的输入框的IDX
    })
  },
  //当有单价调整策略时点击价格  价格调整弹出框确定按钮
  "ensure_entry":function(){

    var self = this, regNumber = this.data.regNumber, submitArr = self.data.submitArr, orderSubmit = self.data.orderSubmit;

    // 判断输入的是否为数字，不是数字则return
    if (parseInt(self.data.inputValue).toString() == "NaN") {
      self.setData({
        isHidden: 'none'
      })
      return;
　　}

    if (self.data.inputValue > parseFloat(submitArr[self.data.inputNum].PRODUCT_POLICY[0].AMOUNT_END)) {

      self.setData({
        tagHidden: 'block',
        tagContent: "价格超出上限"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return ;
    } else if (self.data.inputValue < parseFloat(submitArr[self.data.inputNum].PRODUCT_POLICY[0].AMOUNT_START)){
      self.setData({
        tagHidden: 'block',
        tagContent: "价格低于下限"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    }

    //处理实际价格  orderSubmit里面的实际价格也需要改变
    var ACT_PRICE = parseFloat(this.data.ACT_PRICE) - (regNumber[self.data.orderList[self.data.inputNum].PRODUCT_IDX] - self.data.inputValue ) * submitArr[self.data.inputNum].number; 

    //改变orderSubmit里面的实际价格
    orderSubmit.OrderDetails[self.data.inputNum].ACT_PRICE = self.data.inputValue;

    regNumber[self.data.orderList[self.data.inputNum].PRODUCT_IDX] = self.data.inputValue;

    this.setData({
      isHidden: "none",
      regNumber: regNumber,
      ACT_PRICE: ACT_PRICE,
      orderSubmit: orderSubmit
    })
  },
  //当有单价调整策略时点击价格  价格调整弹出框取消按钮
  "cancel_entry": function () {
    this.setData({
      isHidden: "none"
    })
  },
  ////当有单价调整策略时点击价格  获取价格调整弹出框中输入的值
  "goodsNum":function(e){

    this.setData({
      inputValue: e.detail.value,//在输入框中输入的产品数量
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

    this.setData({
      submitArr: getApp().globalData.submitArr,
      pay_typeInfo: options.pay_typeInfo,
      TO_IDX: options.TO_IDX,//地址idx
      strPartyIdx: options.strPartyIdx,
      pay_type: options.pay_type
    })

    var OrderDetails = [];
    var ACT_PRICE;
    for (var i = 0; i < submitArr.length; i++) {

      if (submitArr[i].PRODUCT_POLICY.length) {
        for (var n = 0; n < submitArr[i].PRODUCT_POLICY.length; n++) {
          if (submitArr[i].PRODUCT_POLICY[n].POLICY_TYPE.indexOf(options.pay_type) != -1) {
            ACT_PRICE = submitArr[i].PRODUCT_POLICY[n].SALE_PRICE
          } else {
            ACT_PRICE = submitArr[i].PRODUCT_PRICE
          }
        }
      } else {
        ACT_PRICE = submitArr[i].PRODUCT_PRICE
      }

      OrderDetails[i] = {
        "ACT_PRICE": ACT_PRICE,//判断
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
        "PO_WEIGHT": submitArr[i].PRODUCT_WEIGHT * submitArr[i].number,
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
      "PAYMENT_TYPE": options.pay_type,
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

    console.log(res)

    console.log(getApp().globalData.submitArr)

    var self = this;

    var orderSubmit = res.result;

    if (res.type == 1) {

      var ACT_PRICE;//实际价格
      var OrderDetails = res.result.OrderDetails; //订单列表（可能包含礼品）
      var orderList = [], GiftClasses = [], priceReg = [], regNumber = [], submitArr = self.data.submitArr, AMOUNT_START, AMOUNT_END;

      //判断是否有赠品
      for (var i = 0; i < OrderDetails.length; i++) {

        if (OrderDetails[i].PRODUCT_TYPE == "NR") {
          //为正常下的订单
          orderList[orderList.length] = OrderDetails[i];
          
          if (orderList[orderList.length - 1].LOTTABLE06=="Y"){

            priceReg[i] = true;

            AMOUNT_START = parseFloat(submitArr[orderList.length - 1].PRODUCT_POLICY[0].AMOUNT_START);

            AMOUNT_END = parseFloat(submitArr[orderList.length - 1].PRODUCT_POLICY[0].AMOUNT_END);

            submitArr[orderList.length - 1].PRODUCT_POLICY[0].AMOUNT_START = AMOUNT_START.toFixed(1);
            submitArr[orderList.length - 1].PRODUCT_POLICY[0].AMOUNT_END = AMOUNT_END.toFixed(1);

            var floatNumber = parseFloat(submitArr[orderList.length - 1].PRODUCT_POLICY[0].SALE_PRICE);

            regNumber[orderList[orderList.length - 1].PRODUCT_IDX] = floatNumber.toFixed(1);
          }else{
            priceReg[i] = false;
            regNumber[orderList[orderList.length - 1].PRODUCT_IDX] = 0;
          }

        } else if (OrderDetails[i].PRODUCT_TYPE == "GF") {
          //为送的赠品
          GiftClasses[GiftClasses.length] = OrderDetails[i];

        }
      }

      //有赠品时，无赠品信息提示消失
      if (GiftClasses.length) {
        self.setData({
          noneGift: "none"
        })
      }

      //是否可以手动添加赠品
      if (getApp().globalData.BUSINESS_CODE.indexOf('YIB') == -1 && getApp().globalData.BUSINESS_CODE.indexOf('DKI') == -1 && res.result.HAVE_GIFT == 'Y') {

        //添加到全局变量
        getApp().globalData.GiftClasses = res.result.GiftClasses;

        self.setData({
          addGift_hidden: "block",
          noneGift: "block",
          giftNone:"none"
        })
      }
      //判断是否有满减
      if (res.result.MJ_REMARK == null || res.result.MJ_REMARK == '' || res.result.MJ_REMARK == '+|+') {
        //无满减
        ACT_PRICE = res.result.ACT_PRICE;

      } else {
        //有满减
        ACT_PRICE = res.result.ACT_PRICE - res.result.MJ_PRICE;

        self.setData({
          MJ_hidden: "block",
          MJ_PRICE: res.result.MJ_PRICE,//满减总计
          MJ_REMARK: res.result.MJ_REMARK,//满减策略
        })
      }
      orderSubmit.ACT_PRICE = ACT_PRICE;

      console.log(orderList)

      console.log(getApp().globalData.giftArr)
      console.log(GiftClasses)

      self.setData({
        orderList: orderList,//订单信息列表
        GiftClasses: GiftClasses,//赠品列表
        TOTAL_QTY: res.result.TOTAL_QTY,//总数
        re_TOTAL_QTY: res.result.TOTAL_QTY,//总数 备用
        ORG_PRICE: res.result.ORG_PRICE,//原价
        re_ORG_PRICE: res.result.ORG_PRICE,//原价  备用
        PAYMENT_TYPE: res.result.PAYMENT_TYPE,//付款方式
        ACT_PRICE: ACT_PRICE,//实际付款
        re_ACT_PRICE: ACT_PRICE,//实际付款  备用
        orderSubmit: orderSubmit,
        priceReg: priceReg,//是否有单价策略调整
        regNumber: regNumber, //有单价策略调整时，现价
        submitArr: submitArr,
        orgiGiftClass: GiftClasses,//送的赠品数组

      })

      console.log(ACT_PRICE)

      console.log(self.data.orgiGiftClass)
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
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      val: val
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
    
    console.log(getApp().globalData.giftArr)

    console.log(this.data.orgiGiftClass)

    var self = this;
   
    var giftArr = getApp().globalData.giftArr;

    if (giftArr.length) {
      self.setData({
        addGift: "重新添加",
        giftNone: "none",
        GiftClasses: self.data.orgiGiftClass.concat(giftArr),
        ACT_PRICE: self.data.re_ACT_PRICE,
        ORG_PRICE: self.data.re_ORG_PRICE,
        TOTAL_QTY: self.data.re_TOTAL_QTY,
      })
      var TOTAL_QTY = self.data.TOTAL_QTY;//总数

      for (var oj = 0; oj < giftArr.length; oj++) {

        TOTAL_QTY = self.data.TOTAL_QTY + giftArr[oj].PO_QTY;

        self.setData({
          TOTAL_QTY: TOTAL_QTY,//总数
        })

        if (giftArr[oj].PRODUCT_DESC == "空瓶费") {
          
          self.setData({
            ORG_PRICE: self.data.ORG_PRICE + giftArr[oj].PO_QTY * giftArr[oj].ACT_PRICE,//原价
            ACT_PRICE: self.data.ACT_PRICE + giftArr[oj].PO_QTY * giftArr[oj].ACT_PRICE,//实际付款
          })
        }
      }

      var GiftClasses = self.data.GiftClasses;


      // 空瓶费现价
      for (var i = 0; i < GiftClasses.length; i++) {

        GiftClasses[i].gift_Price = 0;

        if (GiftClasses[i].PRODUCT_DESC == "空瓶费") {

          GiftClasses[i].gift_Price = 1;
        }
      }

    } else {

      self.setData({
        addGift: "添加赠品",
        giftNone: "none",
        GiftClasses: self.data.orgiGiftClass,
        ACT_PRICE: self.data.re_ACT_PRICE,
        ORG_PRICE: self.data.re_ORG_PRICE,
        TOTAL_QTY: self.data.re_TOTAL_QTY,
      })

      var GiftClasses = self.data.GiftClasses;

      // 空瓶费现价
      for (var i = 0; i < GiftClasses.length; i++) {

        GiftClasses[i].gift_Price = 0;

        if (GiftClasses[i].PRODUCT_DESC == "空瓶费") {

          GiftClasses[i].gift_Price = 1;
        }
      }
    }

    self.setData({
      GiftClasses: GiftClasses
    })
    
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
   //PRODUCT_POLICY数组中的数据形式
    // "ProductPolicy"=[
    //   {
    //     "POLICY_NAME": "怡宝饮料先付款再发货优惠",
    //     "POLICY_TYPE": "101_FPAD",
    //     "AMOUNT_START": "2014 - 09 - 01 00: 00:00",
    //     "AMOUNT_END": "2014 - 12 - 31 00: 00:00",
    //     "REQUEST_BATCH": "",
    //     "SALE_PRICE": 27.50,
    //     "PolicyItems": [
    //       {
    //         "Condition": ["50箱", "100箱", "150箱"],
    //         "Discount": ["5瓶","10瓶", "20瓶"]
    //       },
		// 	{"Condition": ["200箱", "400箱", "600箱"],
    //         "Discount": ["1箱","2箱", "4箱"]
    //       }
    //     ]
    //   },
		//  { 
    //     "POLICY_NAME": "怡宝饮料货到付款优惠",
    //     "POLICY_TYPE": "102_FDAP",
    //     "AMOUNT_START": "2014 - 06 - 01 00: 00:00",
    //     "AMOUNT_END": "2014 - 12 - 31 00: 00:00",
    //     "REQUEST_BATCH": "",
    //     "SALE_PRICE": 28.00,
    //     "PolicyItems": [
    //       {
    //         "Condition": ["200箱", "400箱", "600箱"],
    //         "Discount": ["1箱","2箱", "4箱"]
    //       }
    //     ]
    //   },
		//  { 
    //     "POLICY_NAME": "怡宝饮料月结",
    //     "POLICY_TYPE": "103_MP",
    //     "AMOUNT_START": "2014 - 01 - 01 00: 00:00",
    //     "AMOUNT_END": "2014 - 12 - 31 00: 00:00",
    //     "REQUEST_BATCH": "",
    //     "SALE_PRICE": 28.50,
    //     "PolicyItems": [
    //       {
    //         "Condition": ["50箱", "100箱", "150箱"],
    //         "Discount": ["5瓶","10瓶", "20瓶"]
    //       },
		// 	{"Condition": ["200箱", "400箱", "600箱"],
    //         "Discount": ["1箱","2箱", "4箱"]
    //       }
    //     ]
    //   },
		// { 
    //     "POLICY_NAME": "兑奖",
    //     "POLICY_TYPE": DJ,
    //     "AMOUNT_START": "2014 - 09 - 01 00: 00:00",
    //     "AMOUNT_END": "2014 - 12 - 31 00: 00:00",
    //     "REQUEST_BATCH": "",
    //     "SALE_PRICE": "00.00",   
    //     "PolicyItems": [

    //     ]
    //   }
    // ]

          /**
     * 业务类型为怡宝的常量
     */
    // TYPE_YIBAO = "YIB";
  /**
   * 业务类型为鼎葵的常量
   */
  // TYPE_DIKUI = "DKI";

  /**
   * 业务类型为凯东源前海项目的常量
   */
  //   TYPE_KANGSHIFU = "QHI";
  /**
   * 业务类型为凯东源贸易的常量
   */
  //  TYPE_KDYMY="MYI";


  // 最终提交 
  /*
   var OrderDetails= [
    {
      "ACT_PRICE": 42.7,
      "ADD_DATE": "1900-01-01T00:00:00",
      "EDIT_DATE": "1900-01-01T00:00:00",
      "ENT_IDX": 9008,
      "IDX": 0,
      "LINE_NO": 1,
      "LOTTABLE01": "",
      "LOTTABLE02": "NR",
      "LOTTABLE03": "",
      "LOTTABLE04": "",
      "LOTTABLE05": "",
      "LOTTABLE06": "N",
      "LOTTABLE07": "",
      "LOTTABLE08": "",
      "LOTTABLE09": "",
      "LOTTABLE10": "茶派系列",
      "LOTTABLE11": 0,
      "LOTTABLE12": 0,
      "LOTTABLE13": 0,
      "MJ_PRICE": 0,
      "MJ_REMARK": "",
      "OPERATOR_IDX": 29,
      "ORDER_IDX": 0,
      "ORG_PRICE": 42.7,
      "PO_QTY": 100,
      "PO_UOM": "",
      "PO_VOLUME": 0,
      "PO_WEIGHT": 668,
      "PRODUCT_IDX": 40256,
      "PRODUCT_NAME": "农夫山泉茶派玫瑰荔枝",
      "PRODUCT_NO": "NF.0031",
      "PRODUCT_TYPE": "NR",
      "PRODUCT_URL": "",
      "SALE_REMARK": ""
    }, {
      "ACT_PRICE": 41.5,
      "ADD_DATE": "1900-01-01T00:00:00",
      "EDIT_DATE": "1900-01-01T00:00:00",
      "ENT_IDX": 9008,
      "IDX": 0,
      "LINE_NO": 2,
      "LOTTABLE01": "",
      "LOTTABLE02": "NR",
      "LOTTABLE03": "",
      "LOTTABLE04": "",
      "LOTTABLE05": "",
      "LOTTABLE06": "N",
      "LOTTABLE07": "",
      "LOTTABLE08": "",
      "LOTTABLE09": "",
      "LOTTABLE10": "果园30%果蔬汁系列",
      "LOTTABLE11": 0,
      "LOTTABLE12": 0,
      "LOTTABLE13": 0,
      "MJ_PRICE": 0,
      "MJ_REMARK": "",
      "OPERATOR_IDX": 29,
      "ORDER_IDX": 0,
      "ORG_PRICE": 41.5,
      "PO_QTY": 200,
      "PO_UOM": "",
      "PO_VOLUME": 0,
      "PO_WEIGHT": 1440,
      "PRODUCT_IDX": 40243,
      "PRODUCT_NAME": "农夫500ML果园30%果蔬汁番莓味",
      "PRODUCT_NO": "NF.0018",
      "PRODUCT_TYPE": "NR",
      "PRODUCT_URL": "",
      "SALE_REMARK": ""
    },{
      "ACT_PRICE": 0,
      "ENT_IDX": 9008,
      "IDX": 0,
      "LINE_NO": 3,
      "LOTTABLE02": "NR",
      "LOTTABLE06": "N",
      "LOTTABLE09": "N",
      "LOTTABLE11": 0,
      "LOTTABLE12": 0,
      "LOTTABLE13": 0,
      "MJ_PRICE": 0,
      "OPERATOR_IDX": 29,
      "ORDER_IDX": 0,
      "ORG_PRICE": 42.7,
      "PO_QTY": 10,
      "PO_VOLUME": 0,
      "PO_WEIGHT": 66.8,
      "PRODUCT_IDX": 40256,
      "PRODUCT_NAME": "农夫山泉茶派玫瑰荔枝",
      "PRODUCT_NO": "NF.0031",
      "PRODUCT_TYPE": "GF",
      "SALE_REMARK": "农夫山泉茶派玫瑰荔枝分类赠品"
    },{
      "ACT_PRICE": 0,
      "ENT_IDX": 9008,
      "IDX": 0,
      "LINE_NO": 4,
      "LOTTABLE02": "NR",
      "LOTTABLE06": "N",
      "LOTTABLE09": "N",
      "LOTTABLE11": 0,
      "LOTTABLE12": 0,
      "LOTTABLE13": 0,
      "MJ_PRICE": 0,
      "OPERATOR_IDX": 29,
      "ORDER_IDX": 0,
      "ORG_PRICE": 42.7,
      "PO_QTY": 6,
      "PO_VOLUME": 0,
      "PO_WEIGHT": 45,
      "PRODUCT_IDX": 40260,
      "PRODUCT_NAME":
      "农夫山泉茶派柚子绿茶",
      "PRODUCT_NO": "NF.0035",
      "PRODUCT_TYPE": "GF",
      "SALE_REMARK": "农夫山泉茶派柚子绿茶分类赠品"
    }];
   var submitString = {
      "ACT_PRICE": 12570,
      "ADD_DATE": "1900-01-01T00:00:00",
      "BUSINESS_IDX": "92",
      "BUSINESS_TYPE": 0,
      "CONSIGNEE_REMARK": "测试数据备注信息……",
      "EDIT_DATE": "1900-01-01T00:00:00",
      "ENT_IDX": 9008,
      "FROM_ADDRESS": "",
      "FROM_CITY": "",
      "FROM_CNAME": "",
      "FROM_CODE": "",
      "FROM_COUNTRY": "",
      "FROM_CSMS": "",
      "FROM_CTEL": "",
      "FROM_IDX": 0,
      "FROM_NAME": "",
      "FROM_PROPERTY": "",
      "FROM_PROVINCE": "",
      "FROM_REGION": "",
      "FROM_ZIP": "",
      "GROUP_NO": "",
      "GiftClasses": [{ "checked": false, "choiceCount": 0, "pRICE": 0, "qTY": 16, "tYPE_NAME": "茶派系列" }],
      "HAVE_GIFT": "Y",
      "IDX": 0,
      "MJ_PRICE": 0,
      "MJ_REMARK": "",
      "OPERATOR_IDX":"29",
      "ORD_NO": "",
      "ORD_NO_CLIENT": "",
      "ORD_NO_CONSIGNEE": "",
      "ORD_STATE": "PENDING",
      "ORG_IDX": 0,
      "ORG_PRICE": 13253.2,
      "OrderDetails": OrderDetails,
      "PARTY_IDX": 72660,
      "PAYMENT_TYPE": "FPAD",
      "REQUEST_DELIVERY": "2019-02-08 10:18:45",   //选择的时间
      "REQUEST_ISSUE": "1900-01-01T00:00:00",
      "TOTAL_QTY": 316,
      "TOTAL_VOLUME": 0,
      "TOTAL_WEIGHT": 3046,
      "TO_ADDRESS": "",
      "TO_CITY": "",
      "TO_CNAME": "",
      "TO_CODE": "01.01.0002",
      "TO_COUNTRY": "",
      "TO_CSMS": "",
      "TO_CTEL": "",
      "TO_IDX": 73529,
      "TO_NAME": "",
      "TO_PROPERTY": "",
      "TO_PROVINCE": "",
      "TO_REGION": "",
      "TO_ZIP": ""
    }
  */