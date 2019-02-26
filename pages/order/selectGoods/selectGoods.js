// pages/order/selectGoods/selectGoods.js
var utils = require("../../../utils/util.js");
// 页面问题：有些页面跳转进来时，是没有选择付款方式的，如果没有，则可以不请求选择付款方式
Page({

  /**
   * 页面的初始数据
   * 
   * 
   *  // PARTY_NAME: options.PARTY_NAME, //目标客户
      // CONTACT_PERSON: options.CONTACT_PERSON,//客户名称
      // CONTACT_TEL: options.CONTACT_TEL, // 电话
      // ADDRESS_INFO: options.ADDRESS_INFO,//目标地址
      // ADDRESS_CODE: options.ADDRESS_CODE,
      // strPartyIdx: options.strPartyIdx,
      // strPartyAddressIdx: options.strPartyAddressIdx,
   */
  data: {
    number:{},
    goodsList:[],//搜索结果
    reData: [],//数据列表
    totalNum:0, //总数量
    totalPrice: 0, //总价格
    isHidden:'none',//输入产品数量弹出框是否显示
    elseHidden:'block', //其他信息弹出框是否显示
    payHidden:"none", //付款方式列表是否显示
    payDatalist:[], //付款方式数据列表
    succHidden:[], //付款方式中的对勾是否显示
    clickNum:0,
    open: 0, //左侧边栏开关
    rightOpen:0, //右侧边栏开关
    cartShow:0,//购物车是否上拉
    typeList: [],//类型列表
    classList:[],//分类列表
    showType:"全部", //类型显示
    showClass:"全部", //分类显示
    strProductClass:'',//分类
    addressHidden:"none", //发货方地址  是否显示
    payWayHidden:"block",// 客户信息中的付款方式是否显示
    elseInfo:"其他信息",// 显示 其他信息 或者显示 客户信息
    tagContent:"至少选择一种商品",//提示信息
    tagHidden:"none",//提示信息是否出现
    submitArr:[],
    element:'',//点击“页面”的或者“购物车”的输入产品数量输入框
    salesHidden:[],//促销信息隐藏
    monthlySales: "block",//每月计划页面不显示促销信息
  },
 
  //提价按钮
  "submit":function(){
    var self=this;

    if (self.data.totalNum){
      getApp().globalData.submitArr = self.data.submitArr;

      //此处的判断条件不严谨（后期需要再处理）
      if (self.data.payDatalist.length){
        //跳转到下单的订单确认页
        wx.navigateTo({
          url: 'orderCertain/orderCertain?pay_type=' + self.data.payDatalist[self.data.clickNum].Key + "&TO_IDX=" + self.data.options.strPartyAddressIdx + "&ADDRESS_CODE=" + self.data.options.ADDRESS_CODE + "&strPartyIdx=" + self.data.options.strPartyIdx + "&pay_typeInfo=" + self.data.payDatalist[self.data.clickNum].Text
        })
      }else{
        //跳转到每月计划的订单确认页
        wx.navigateTo({
          url: '../../index/monthlyPlan/planOrderCertain/planOrderCertain?&PARTY_TYPE=' + self.data.options.PARTY_TYPE + "&PARTY_CODE=" + self.data.options.PARTY_CODE + "&PARTY_CITY=" + self.data.options.PARTY_CITY + "&PARTY_NAME=" + self.data.options.PARTY_NAME + "&CONTACT_PERSON=" + self.data.options.CONTACT_PERSON + "&CONTACT_TEL=" + self.data.options.CONTACT_TEL + "&ADDRESS_INFO=" + self.data.options.ADDRESS_INFO + "&strPartyIdx=" + self.data.options.strPartyIdx + "&ADDRESS_CODE=" + self.data.options.ADDRESS_CODE + "&TO_IDX=" + self.data.options.strPartyAddressIdx
        })
      }

    }else{
      // 至少选择一种商品
      self.setData({
        tagHidden:"block"
      })

      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
    }
  },
  //点击商品，促销信息展开
  "salesBind":function(e){
    var self=this;

    var salesHidden = this.data.salesHidden;

    if (this.data.salesHidden[e.currentTarget.id]=="none"){
      salesHidden[e.currentTarget.id] = "block";
    }else{
      salesHidden[e.currentTarget.id] = "none";
    }
    this.setData({
      salesHidden: salesHidden
    })
  },
  //重新排列（全部）
  "reList":function(e){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;

    if (e.currentTarget.dataset.element){
      self.setData({
        showClass:'全部'
      })
    }

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetProductListType",
      method: "POST",
      data: {
        "strPartyIdx": self.data.options.strPartyIdx,
        "strBusinessId": getApp().globalData.BUSINESS_IDX,
        "strPartyAddressIdx": self.data.options.strPartyAddressIdx,
        "strProductType":'',
        "strProductClass": '',
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();
    
        if(res.data.type==1){
          var result = res.data.result;

          for (var i = 0; i < res.data.result.length; i++) {

            //如果有逗号，则截取。没有逗号，则不截取
            if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC_show.substring(0, result[i].PRODUCT_DESC_show.indexOf(","))
            } else {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC
            }
          }
          self.setData({
            goodsList: res.data.result,
            reData: res.data.result,
            showType: "全部",
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
  //按照分类重新排列
  "reClassList":function(e){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetProductListType",
      method: "POST",
      data: {
        "strPartyIdx": self.data.options.strPartyIdx,
        "strBusinessId": getApp().globalData.BUSINESS_IDX,
        "strPartyAddressIdx": self.data.options.strPartyAddressIdx,
        "strProductType": '',
        "strProductClass": self.data.classList[e.currentTarget.id],
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();
       
        if(res.data.type==1){

          var result = res.data.result;

          for (var i = 0; i < res.data.result.length; i++) {

            //如果有逗号，则截取。没有逗号，则不截取
            if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC_show.substring(0, result[i].PRODUCT_DESC_show.indexOf(","))
            } else {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC
            }
          }
          self.setData({
            goodsList: res.data.result,
            reData: res.data.result,
            showClass: self.data.classList[e.currentTarget.id], //分类显示
            showType: "全部",
            strProductClass: self.data.classList[e.currentTarget.id]
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
  //按照类型重新排列
  "reTypeList":function(e){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;
 
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetProductListType",
      method: "POST",
      data: {
        "strPartyIdx": self.data.options.strPartyIdx,
        "strBusinessId": getApp().globalData.BUSINESS_IDX,
        "strPartyAddressIdx": self.data.options.strPartyAddressIdx,
        "strProductType": self.data.typeList[e.currentTarget.id],
        "strProductClass": self.data.strProductClass,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if(res.data.type==1){
          var result = res.data.result;

          for (var i = 0; i < res.data.result.length; i++) {

            //如果有逗号，则截取。没有逗号，则不截取
            if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC_show.substring(0, result[i].PRODUCT_DESC_show.indexOf(","))
            } else {
              result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME
              result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC
            }
          }
          self.setData({
            goodsList: res.data.result,
            reData: res.data.result,
            showType: self.data.typeList[e.currentTarget.id], //类型显示
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
  //购物车是否出现
  "cartShow":function(){
    var self =this;

    if (self.data.cartShow == '0') {

      this.setData({
        cartShow: -150
      })
   
    } else if (self.data.cartShow == '-150') {
      this.setData({
        cartShow: 0
      })

    }
    var animation3 = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })

    animation3.translateY(self.data.cartShow).step()

    this.setData({
      animationData3: animation3.export()
    })

  },
  //左侧边栏开关
  "leftOpen":function(e){

    var self=this;

    if(self.data.open=='0'){

      this.setData({
        open:136
      })
        
    }else if(self.data.open=='136'){
      this.setData({
        open: 0
      })
    }

    var animation = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })

    animation.translateX(parseInt(self.data.open)).step()

    this.setData({
      animationData: animation.export()
    })

  },
  //右侧边栏开关
  "rightOpen":function(){

    var self = this;

    if (self.data.rightOpen == '0') {

      this.setData({
        rightOpen: -136
      })
     
    } else if (self.data.rightOpen == '-136') {
      this.setData({
        rightOpen: 0
      })

    }

    var animation2 = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })

    animation2.translateX(self.data.rightOpen).step()

    this.setData({
      animationData2: animation2.export()
    })

  },
  //其他信息  选择付款方式
  "payBind":function(e){
    var self = this;
    
    var succHidden=[];

    for (var m = 0; m < this.data.payDatalist.length;m++){
      succHidden[m]='none'
    }
    succHidden[e.currentTarget.id] = 'block';

    this.setData({
      
      clickNum: e.currentTarget.id,
      succHidden: succHidden
    })
    setTimeout(function(){
      self.setData({
        payHidden: 'none',
      })
    },500)
  },
  // 其他信息  付款方式列表是否显示(收起来)
  "selectPayWay":function(){

    if (this.data.payHidden=='none'){

      var is_hidden = 'block';

    } else if (this.data.payHidden == 'block'){

      var is_hidden = 'none';
    }

    this.setData({
      payHidden: is_hidden
    })
  },
  //其他信息 弹出框显示
  "elseBind":function(){

    this.setData({
      elseHidden: 'block'
    })

  },
  // 其他信息  确认按钮点击事件
  "elseInfo_submit":function(){

    this.setData({
      elseHidden:'none',
      payHidden:'none'
    })

  },
  //输入产品数量输入框   取消按钮
  "cancel_entry":function(){

    this.setData({
      isHidden: 'none'   
    })

  },
  // 输入产品数量输入框   确认按钮
  "ensure_entry": function () {
    var self=this;

    // 判断输入的是否为数字，不是数字则return
    if (parseInt(self.data.inputValue).toString() == "NaN") {
      self.setData({
        isHidden: 'none'   
      })
  　  return;
　　}

    var number = this.data.number;

    var submitArr = this.data.submitArr;
 
    var isRepeat = false;

    var totalNum = this.data.totalNum;

    var totalPrice = this.data.totalPrice;

    if (submitArr.length){
     
      if (self.data.element == '页面') {
        
        for (var i = 0; i < submitArr.length; i++) {

          if (submitArr[i].IDX == self.data.goodsList[self.data.inputNum].IDX) {

            submitArr[i].number = parseInt(self.data.inputValue);

            isRepeat = true;
          }
        }

        if (!isRepeat && self.data.inputValue != 0) {

          submitArr[submitArr.length] = self.data.goodsList[self.data.inputNum];

          submitArr[submitArr.length - 1].number = parseInt(self.data.inputValue);
        } 

        // 产品总数量重新计算
        totalNum = parseInt(self.data.totalNum) - number[self.data.goodsList[self.data.inputNum].IDX] + parseInt(self.data.inputValue);

        //产品总价格重新计算
        totalPrice = parseFloat(self.data.totalPrice) + (parseInt(self.data.inputValue) - number[self.data.goodsList[self.data.inputNum].IDX]) * self.data.goodsList[self.data.inputNum].PRODUCT_PRICE;
        
        //页面上number重新显示
        number[self.data.goodsList[self.data.inputNum].IDX] = parseInt(self.data.inputValue);

        // 输入产品数量如果小于零，该物品在购物车中消失
        if (self.data.inputValue == 0) {

          for (var j = 0; j < submitArr.length; j++) {

            if (submitArr[j].IDX == self.data.goodsList[self.data.inputNum].IDX) {

              submitArr.splice(j, 1);
            }
          }
        }

      } else if (self.data.element == '购物车') {

        // 产品总数量重新计算
        totalNum = parseInt(self.data.totalNum) - submitArr[self.data.inputNum].number + parseInt(self.data.inputValue);

        //产品总价格重新计算
        totalPrice = parseFloat(self.data.totalPrice) + (parseInt(self.data.inputValue) - parseInt(submitArr[self.data.inputNum].number)) * submitArr[self.data.inputNum].PRODUCT_PRICE;

        //页面上number重新显示
        number[submitArr[self.data.inputNum].IDX] = parseInt(self.data.inputValue);

        submitArr[self.data.inputNum].number = parseInt(self.data.inputValue);

        // 输入产品数量如果小于零，该物品在购物车中消失
        if (self.data.inputValue == 0) {  

          submitArr.splice(self.data.inputNum, 1);
        }
      }
  
    }else{

      if (self.data.inputValue != 0 ){

        submitArr[0] = self.data.goodsList[self.data.inputNum];

        submitArr[0].number = parseInt(self.data.inputValue);

        totalNum = parseInt(self.data.inputValue);

        totalPrice = totalNum * self.data.goodsList[self.data.inputNum].PRODUCT_PRICE;

        number[self.data.goodsList[self.data.inputNum].IDX] = parseInt(self.data.inputValue);
      }
    }
   
    this.setData({
      isHidden: 'none',
      number:number,
      submitArr: submitArr,
      totalNum: totalNum,
      totalPrice: totalPrice.toFixed(1)
    })
  },
  //显示  输入产品数量输入框
  "entryShow":function(e){

    var self=this;

    if (e.currentTarget.dataset.element=='页面'){

      self.setData({
        element:"页面"
      })
    } else if (e.currentTarget.dataset.element == '购物车'){

      self.setData({
        element: "购物车"
      })
    }
    this.setData({
      isHidden: 'block',
      inputNum: e.currentTarget.id,//点击的输入框的IDX
    })
  },
  // bindinput事件  监听input的value值
  "goodsNum": function (e) {
   
    this.setData({
      inputValue: e.detail.value,//在输入框中输入的产品数量
    })
  },
  
  // 列表数量  减
  'jian':function(e){
   
    var self = this;

    if (self.data.number[self.data.goodsList[e.currentTarget.id].IDX]>0){

      var number = self.data.number;

      number[self.data.goodsList[e.currentTarget.id].IDX] = number[self.data.goodsList[e.currentTarget.id].IDX] - 1;

      var totalPrice = parseFloat(self.data.totalPrice) - parseFloat(self.data.goodsList[e.currentTarget.id].PRODUCT_PRICE);

      var submitArr = self.data.submitArr;

      // 购物车中的数量减少
      for (var i = 0; i < submitArr.length;i++){

        if (submitArr[i].IDX == self.data.goodsList[e.currentTarget.id].IDX){

          submitArr[i].number = number[self.data.goodsList[e.currentTarget.id].IDX];


          // 购物车物品数量如果小于零，该物品消失
          if (number[self.data.goodsList[e.currentTarget.id].IDX] == 0) {

                submitArr.splice(i, 1);
          }
        }
      }
      self.setData({
        number: number,
        totalNum: self.data.totalNum - 1,
        totalPrice: totalPrice.toFixed(1),
        submitArr: submitArr
      })
    }
  },
  // 列表  加
  "jia":function(e){
  
    var self = this;

    var number = this.data.number;

    number[this.data.goodsList[e.currentTarget.id].IDX] = number[this.data.goodsList[e.currentTarget.id].IDX]+1;

    var totalPrice = parseFloat(self.data.totalPrice) + parseFloat(self.data.goodsList[e.currentTarget.id].PRODUCT_PRICE);

    var submitArr = this.data.submitArr;

    var isRepeat=false;

    if (submitArr.length==0){

      submitArr[0] = self.data.goodsList[e.currentTarget.id];
      submitArr[0].number = 1;
     
    }else{
      for (var j = 0; j < submitArr.length; j++) {

        if (submitArr[j].IDX == self.data.goodsList[e.currentTarget.id].IDX) {

          isRepeat = true;
          submitArr[j].number = number[self.data.goodsList[e.currentTarget.id].IDX];
        }
      }

      if (!isRepeat){

        submitArr[submitArr.length] = self.data.goodsList[e.currentTarget.id];

        submitArr[submitArr.length-1].number = 1;
      }
    }
    
    this.setData({
      number: number,
      submitArr: submitArr,
      totalNum: self.data.totalNum + 1,
      totalPrice: totalPrice.toFixed(1),
    })
  },
  // 购物车 减
  "jian2":function(e){ 

    var self=this;

    var submitArr = this.data.submitArr;
    var g_number=this.data.number;

    submitArr[e.currentTarget.id].number--;

   // 总价  减少
    var totalPrice = parseFloat(self.data.totalPrice) - parseFloat(self.data.submitArr[e.currentTarget.id].PRODUCT_PRICE);

    var num;

    for (var i = 0; i < self.data.goodsList.length; i++) {

      if (self.data.goodsList[i].IDX == submitArr[e.currentTarget.id].IDX) {

        g_number[self.data.goodsList[i].IDX]--;
       
        num=i;
      }
    }

    // 购物车物品数量如果小于零，该物品消失
    if (submitArr[e.currentTarget.id].number == 0) {

      submitArr.splice(e.currentTarget.id, 1);
    } 
    
    this.setData({
      submitArr: submitArr,
      number: g_number,
      totalNum: self.data.totalNum - 1,
      totalPrice: totalPrice.toFixed(1),
    })
  },
  // 购物车 加
  "jia2":function(e){
    var self = this;

    var submitArr = this.data.submitArr;
    var g_number = this.data.number;

    submitArr[e.currentTarget.id].number++;

   // 总价增加
    var totalPrice = parseFloat(self.data.totalPrice) + parseFloat(self.data.submitArr[e.currentTarget.id].PRODUCT_PRICE);

    for (var i = 0; i < self.data.goodsList.length; i++) {
      if (self.data.goodsList[i].IDX == submitArr[e.currentTarget.id].IDX) {

        g_number[self.data.goodsList[i].IDX]++;
        
      }
    }
    this.setData({
      submitArr: submitArr,
      number: g_number,
      totalNum: self.data.totalNum + 1,
      totalPrice: totalPrice.toFixed(1),
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

    this.setData({
      options: options
    })

    var self= this;

    if (options.monthlyPlan){
      self.setData({
        payWayHidden:"none",
        elseInfo:"客户信息",
        monthlySales:"none",//每月计划页面不显示促销信息
      })
    }

    var orderdata = {
      "strPartyIdx": options.strPartyIdx,
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyAddressIdx": options.strPartyAddressIdx,
      "strProductType": '',
      "strProductClass": '',
      "strLicense": ''
    };
      //发送请求商品列表
    utils.http(options.requestUrl, orderdata, this.orderCallback)

    if (self.data.payWayHidden=="block"){
      //请求其他信息弹出框中的付款方式
      wx.request({
        url: "https://tms.kaidongyuan.com/api/GetPaymentType",
        method: "POST",
        data: {
          "strLicense": ''
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {

          var succHidden = [];
          for (var m = 0; m < res.data.result.length; m++) {
            succHidden[m] = 'none'
          }
          succHidden[0] = 'block';

          self.setData({
            succHidden: succHidden,
            payDatalist: res.data.result
          })
        }
      })
    }
    var ProductTypedata = {
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strLicense": ''
    };
    //请求 类型和分类名称
    utils.http("GetProductType", ProductTypedata, this.ProductTypeCallback)

  },
   //请求 类型和分类名称
  "ProductTypeCallback":function(res){
    var self=this;
 
    if(res.type==1){
      var typeList = [], classList = [];

      var typeJson = {}, classJson = {};

      for (var n = 0; n < res.result.length; n++) {

        //类型
        if (res.result[n].PRODUCT_TYPE) {

          if (!typeJson[res.result[n].PRODUCT_TYPE]) {

            typeList.push(res.result[n].PRODUCT_TYPE);

            typeJson[res.result[n].PRODUCT_TYPE] = 1;
          }
        }

        //分类
        if (res.result[n].PRODUCT_CLASS) {

          if (!classJson[res.result[n].PRODUCT_CLASS]) {

            classList.push(res.result[n].PRODUCT_CLASS);

            classJson[res.result[n].PRODUCT_CLASS] = 1;

          }
        }
      }
      self.setData({
        typeList: typeList,
        classList: classList
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
  //发送请求商品列表
  "orderCallback":function(res){

    console.log(res)

    wx.hideLoading();

    var self = this;

    var salesHidden = this.data.salesHidden;

    if(res.type==1){
      var result = res.result;

      var number = {};
    
      for (var i = 0; i < res.result.length; i++) {

        //如果有逗号，则截取。没有逗号，则不截取
        if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
          result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC_show.substring(0, result[i].PRODUCT_DESC_show.indexOf(","))
        } else {
          result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME;
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC;
        }
        number[res.result[i].IDX] = 0;
       
        salesHidden[i] = "none";
        
      }

      self.setData({
        goodsList: res.result,
        reData: res.result,
        number: number,
        salesHidden: salesHidden
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
  // 按商品名称搜索
  "search":function(e){

    var listData = this.data.reData;

    var reData = [];

    for (var i = 0; i < listData.length; i++) {

      // 要处理字母大小写问题
      if (listData[i].PRODUCT_NAME_show.toUpperCase().indexOf(e.detail.value.toUpperCase()) != -1) {

        reData[reData.length] = listData[i];
      }
    }
    this.setData({
      goodsList: reData
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