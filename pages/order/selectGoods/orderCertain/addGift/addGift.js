// pages/order/selectGoods/orderCertain/addGift/addGift.js  
var utils = require("../../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   * 
   * 
   */
  data: {
    cartShow: 0,//购物车是否上拉
    giftList:[],//赠品列表
    GiftClasses:[],//品类列表
    number: {},
    submitArr:[],
    totalNum: 0, //总数量（已选）
    isHidden: 'none',//输入产品数量弹出框是否显示
    optionalNum: 0,//可选数量
    calssType_list:[],//传输到下单页面的，数组GiftClasses
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
    classSelectIdx:0,//被选中的品类的idx
    overplus:{},//品类中，赠品的剩余数量
  },
  //提价按钮
  "submit": function () {

    var submitArr = this.data.submitArr;

    for (var j = 0; j < submitArr.length;j++){

      if (submitArr[j].PRODUCT_DESC == "空瓶费" ){

        submitArr[j].ACT_PRICE = submitArr[j].PRODUCT_PRICE;
        
      }else{

        submitArr[j].ACT_PRICE = 0 ;
      }
      
    }

    getApp().globalData.giftArr = submitArr;

    console.log(getApp().globalData.giftArr)

    getApp().globalData.overplus = this.data.overplus;

    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;

    //calssType_list 传输到下单页面的，数组GiftClasses
    var calssType_list = [];

    var GiftClasses=getApp().globalData.GiftClasses;
    console.log(GiftClasses)
    var optionalNum = 0, overplus={};
    for (var i = 0; i < GiftClasses.length;i++){
      //计算可选总数
      optionalNum = optionalNum + GiftClasses[i].QTY;

      //剩余数量数组
      overplus[GiftClasses[i].TYPE_NAME] = GiftClasses[i].QTY;

      calssType_list[i] = {
        "checked": false, 
        "choiceCount": 0, 
        "pRICE": 0, 
        "qTY": GiftClasses[i].QTY, 
        "tYPE_NAME": GiftClasses[i].TYPE_NAME 
      }
    }

    this.setData({
      GiftClasses: GiftClasses,
      strPartyIdx: options.strPartyIdx,
      strPartyAddressIdx: options.strPartyAddressIdx,
      optionalNum: optionalNum,//可选数量
      calssType_list: calssType_list,
      overplus: overplus
    })

    var idx = {
      currentTarget:{
        id:0
      }
    }

    this.selectClass(idx)
  },
  "selectClass":function(e){

    var self=this;

    var GiftClasses = getApp().globalData.GiftClasses;

    var number = self.data.number;
    var GiftResult;

    if (GiftClasses[e.currentTarget.id].CLASS_TYPE == "1"){

      var data = {
        "strBusinessId": getApp().globalData.BUSINESS_IDX,
        "strPartyIdx": self.data.strPartyIdx,
        "strPartyAddressIdx": self.data.strPartyAddressIdx,
        "strProductType": self.data.GiftClasses[e.currentTarget.id].TYPE_NAME,
        "strProductClass": '', //空
        "strLicense": ""
      }

      utils.http("GetProductListType", data, self.classCallback);

    } else if (GiftClasses[e.currentTarget.id].CLASS_TYPE == "2"){

      GiftResult = GiftClasses[e.currentTarget.id].PRODUCT_LIST;

      for (var i = 0; i < GiftResult.length; i++) {

        //如果有逗号，则截取。没有逗号，则不截取
        if (GiftResult[i].PRODUCT_NAME.indexOf(",") != -1) {
          GiftResult[i].PRODUCT_NAME_show = GiftResult[i].PRODUCT_NAME.substring(0, GiftResult[i].PRODUCT_NAME.indexOf(","))
          GiftResult[i].PRODUCT_DESC_show = GiftResult[i].PRODUCT_DESC.substring(GiftResult[i].PRODUCT_DESC.indexOf(",") + 1)
          GiftResult[i].PRODUCT_DESC_show = GiftResult[i].PRODUCT_DESC_show.substring(0, GiftResult[i].PRODUCT_DESC_show.indexOf(","))
        } else {
          GiftResult[i].PRODUCT_NAME_show = GiftResult[i].PRODUCT_NAME;
          GiftResult[i].PRODUCT_DESC_show = GiftResult[i].PRODUCT_DESC;
        }

        if (!number[GiftResult[i].IDX]) {

          number[GiftResult[i].IDX] = 0;
        }
      }

      self.setData({
        giftList: GiftResult,
        number: number
      })
    }

    self.setData({
      classSelectIdx: e.currentTarget.id
    })
  },
  'classCallback': function (res) {
    
    var self = this;

    wx.hideLoading();

    console.log(res)

    if(res.type==1){
      var result = res.result;

      var number = self.data.number;

      for (var i = 0; i < res.result.length; i++) {

        //如果有逗号，则截取。没有逗号，则不截取
        if (result[i].PRODUCT_NAME.indexOf(",") != -1) {
          result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME.substring(0, result[i].PRODUCT_NAME.indexOf(","))
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC.substring(result[i].PRODUCT_DESC.indexOf(",") + 1)
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC_show.substring(0, result[i].PRODUCT_DESC_show.indexOf(","))
        } else {
          result[i].PRODUCT_NAME_show = result[i].PRODUCT_NAME
          result[i].PRODUCT_DESC_show = result[i].PRODUCT_DESC
        }

        if (!number[result[0].IDX]) {

          number[result[i].IDX] = 0;
        }
      }
      this.setData({
        giftList: res.result,
        number: number
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
  //购物车是否出现
  "cartShow": function () {
    var self = this;

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

  // 列表数量  减
  'jian': function (e) {

    var self = this;
    var submitArr = self.data.submitArr;

    if (self.data.number[self.data.giftList[e.currentTarget.id].IDX] > 0) {

      var number = self.data.number, overplus = self.data.overplus;

      // 雪花瓶装啤酒 (空瓶费)
      if (self.data.giftList[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

        return;

      } else if (self.data.giftList[e.currentTarget.id].PRODUCT_TYPE == "雪花瓶装啤酒") {

        for (var mn = 0; mn < self.data.giftList.length; mn++) {
          if (self.data.giftList[mn].PRODUCT_DESC == "空瓶费") {

            number[self.data.giftList[mn].IDX] = number[self.data.giftList[mn].IDX] -1;

            var knum ;
            
            // 购物车 空瓶费 数量减少
            for (var j = 0; j < submitArr.length;j++){

              if (submitArr[j].IDX == self.data.giftList[mn].IDX) {

                submitArr[j].PO_QTY = number[self.data.giftList[mn].IDX];
                knum = j;

              }
            }

            // 购物车物品数量如果小于零，该物品消失
            if (number[self.data.giftList[mn].IDX] == 0) {

              submitArr.splice(knum, 1);
            }
            break;
          }
        }
      } 

      number[self.data.giftList[e.currentTarget.id].IDX] = number[self.data.giftList[e.currentTarget.id].IDX] - 1;
      

      //剩余数量
      overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME]++;

  

      // 购物车中的数量减少
      for (var i = 0; i < submitArr.length; i++) {

        if (submitArr[i].IDX == self.data.giftList[e.currentTarget.id].IDX) {

          submitArr[i].PO_QTY = number[self.data.giftList[e.currentTarget.id].IDX];

          // 购物车物品数量如果小于零，该物品消失
          if (number[self.data.giftList[e.currentTarget.id].IDX] == 0) {

            submitArr.splice(i, 1);
          }
        }
      }

      self.setData({
        number: number,
        totalNum: self.data.totalNum - 1,
        submitArr: submitArr,
        overplus: overplus
      })
    }
  },
  // 列表  加
  "jia": function (e) {

    var self = this;

    console.log(this.data.giftList)

    //如果添加赠品数量超过可选数量，则提示信息出现
    if (this.data.overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] <= 0) {

      self.setData({
        tagHidden: 'block',
        tagContent: "超出当前赠品可选数额"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    }

    var number = this.data.number, overplus = this.data.overplus;
    var submitArr = this.data.submitArr;

    var ifKongPF = 0; //ifKongPF为0时没有空瓶费
    var kongpfArr=[];

    // 雪花瓶装啤酒 (空瓶费)
    if (self.data.giftList[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

      return;

    }else if (self.data.giftList[e.currentTarget.id].PRODUCT_TYPE == "雪花瓶装啤酒") {

      for (var mn = 0; mn < self.data.giftList.length; mn++) {
        if (self.data.giftList[mn].PRODUCT_DESC == "空瓶费") {

          // 之前没有空瓶费
          if (number[self.data.giftList[mn].IDX] == 0){

            ifKongPF = 1; //第一个空瓶费
            kongpfArr = self.data.giftList[mn];

          }else{
            ifKongPF = 2; //第n个空瓶费

            kongpfArr = self.data.giftList[mn];
          }

          number[self.data.giftList[mn].IDX] = number[self.data.giftList[mn].IDX] + 1;

          break;
        }
      }
    }

    number[this.data.giftList[e.currentTarget.id].IDX] = number[this.data.giftList[e.currentTarget.id].IDX] + 1;
    
   
    //剩余数量
    overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME]--;

    var isRepeat = false;

    var calssType_list = this.data.calssType_list;

    if (submitArr.length == 0) {

      submitArr[0] = self.data.giftList[e.currentTarget.id];
      submitArr[0].PO_QTY = 1;

      submitArr[0].SALE_REMARK = self.data.giftList[e.currentTarget.id].PRODUCT_NAME + "分类赠品";
      submitArr[0].ORG_PRICE = self.data.giftList[e.currentTarget.id].PRODUCT_PRICE;
    
    } else {

      for (var j = 0; j < submitArr.length; j++) {

        if (submitArr[j].IDX == self.data.giftList[e.currentTarget.id].IDX) {

          isRepeat = true;
          submitArr[j].PO_QTY = number[self.data.giftList[e.currentTarget.id].IDX];

         
        }
      }

      if (!isRepeat) {

        submitArr[submitArr.length] = self.data.giftList[e.currentTarget.id];
        submitArr[submitArr.length - 1].PO_QTY = 1;

        submitArr[submitArr.length - 1].SALE_REMARK = self.data.giftList[e.currentTarget.id].PRODUCT_NAME + "分类赠品";
        submitArr[submitArr.length - 1].ORG_PRICE = self.data.giftList[e.currentTarget.id].PRODUCT_PRICE;   
      }
    }

    // 第一个空瓶费
    if (ifKongPF == 1) {

      submitArr[submitArr.length] = kongpfArr;
      submitArr[submitArr.length - 1].PO_QTY = 1;

      submitArr[submitArr.length - 1].SALE_REMARK = kongpfArr.PRODUCT_NAME + "分类赠品";
      submitArr[submitArr.length - 1].ORG_PRICE = kongpfArr.PRODUCT_PRICE;

    } else if (ifKongPF == 2) {
      // 购物车中已存在空瓶费
      for (var mj = 0; mj < submitArr.length; mj++) {

        if (submitArr[mj].IDX == kongpfArr.IDX) {

          submitArr[mj].PO_QTY++;
        }
      }
    }

    this.setData({
      number: number,
      submitArr: submitArr,
      totalNum: self.data.totalNum + 1,
      calssType_list: calssType_list,
      overplus: overplus
    })
  },
  // 购物车 减
  "jian2": function (e) {

    var self = this;

    var submitArr = this.data.submitArr;
    var g_number = this.data.number, overplus = this.data.overplus;

    // 雪花瓶装啤酒 (空瓶费)
    if (submitArr[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

      return;

    } else if (submitArr[e.currentTarget.id].PRODUCT_TYPE == "雪花瓶装啤酒") {

      for (var mn = 0; mn < self.data.giftList.length; mn++) {
        if (submitArr[mn].PRODUCT_DESC == "空瓶费") {

          submitArr[mn].PO_QTY--;

          g_number[submitArr[mn].IDX]--;

          // 购物车物品数量如果小于零，该物品消失
          if (submitArr[mn].PO_QTY == 0) {

            submitArr.splice(mn, 1);
          }

          break;
        }
      }
    }

    submitArr[e.currentTarget.id].PO_QTY--;

    //剩余数量
    overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME]++;

    var num;

    for (var i = 0; i < self.data.giftList.length; i++) {

      if (self.data.giftList[i].IDX == submitArr[e.currentTarget.id].IDX) {

        g_number[self.data.giftList[i].IDX]--;
        num = i;
      }
    }

    // 购物车物品数量如果小于零，该物品消失
    if (submitArr[e.currentTarget.id].PO_QTY == 0) {

      var calssType_list = self.data.calssType_list;

      submitArr.splice(e.currentTarget.id, 1);
    }

    this.setData({
      submitArr: submitArr,
      number: g_number,
      totalNum: self.data.totalNum - 1,
      calssType_list: calssType_list,
      overplus: overplus
    })

  },
  // 购物车 加
  "jia2": function (e) {
    var self = this;

    //如果添加赠品数量超过可选数量，则提示信息出现
    if (self.data.totalNum + 1 > self.data.GiftClasses[self.data.classSelectIdx].QTY) {

      self.setData({
        tagHidden: 'block',
        tagContent: "超出当前赠品可选数额"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    }

    var submitArr = this.data.submitArr;
    var g_number = this.data.number, overplus = this.data.overplus;

    // 雪花瓶装啤酒 (空瓶费)
    if (submitArr[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

      return;

    } else if (submitArr[e.currentTarget.id].PRODUCT_TYPE == "雪花瓶装啤酒") {

      for (var mn = 0; mn < self.data.giftList.length; mn++) {
        if (submitArr[mn].PRODUCT_DESC == "空瓶费") {

          submitArr[mn].PO_QTY++;

          g_number[submitArr[mn].IDX]++;

          break;
        }
      }
    }

    submitArr[e.currentTarget.id].PO_QTY++;

    //剩余数量
    overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME]--;

    for (var i = 0; i < self.data.giftList.length; i++) {
      if (self.data.giftList[i].IDX == submitArr[e.currentTarget.id].IDX) {
        g_number[self.data.giftList[i].IDX]++;
      }
    }

    this.setData({
      submitArr: submitArr,
      number: g_number,
      totalNum: self.data.totalNum + 1,
      overplus: overplus
    })
  },
  //输入产品数量输入框   取消按钮
  "cancel_entry": function () {

    this.setData({
      isHidden: 'none'
    })

  },
  // 输入产品数量输入框   确认按钮
  "ensure_entry": function () {

    var self = this;

    var number = this.data.number, overplus = this.data.overplus;

    // 判断输入的是否为数字，不是数字则return
    if (parseInt(self.data.inputValue).toString() == "NaN") {
      self.setData({
        isHidden: 'none'
      })
      return;
    }

    var excess=false;

    //如果添加赠品数量超过可选数量，则提示信息出现
    function isExcess(totalNum){
      
      if (totalNum > self.data.GiftClasses[self.data.classSelectIdx].QTY) {

        self.setData({
          tagHidden: 'block',
          tagContent: "超出当前赠品可选数额"
        })
        setTimeout(function () {
          self.setData({
            tagHidden: 'none'
          })
        }, 2000)
        return excess = true;
      }
    }

    var submitArr = this.data.submitArr,isRepeat = false,totalNum = this.data.totalNum;

    if (submitArr.length) {

      if (self.data.element == '页面') {

        // 产品总数量重新计算
        totalNum = parseInt(self.data.totalNum) - number[self.data.giftList[self.data.inputNum].IDX] + parseInt(self.data.inputValue);

        //如果添加赠品数量超过可选数量，则提示信息出现
        isExcess(totalNum);

        if (excess){
          return;
        }

        //剩余数量
        overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] = overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] + number[self.data.giftList[self.data.inputNum].IDX] - parseInt(self.data.inputValue);
      
        for (var i = 0; i < submitArr.length; i++) {

          if (submitArr[i].IDX == self.data.giftList[self.data.inputNum].IDX) {

            submitArr[i].PO_QTY = parseInt(self.data.inputValue);

            if (self.data.giftList[self.data.inputNum].PRODUCT_TYPE == "雪花瓶装啤酒") {

              for (var mj = 0; mj < submitArr.length;mj++){

                // 雪花瓶装啤酒 (页面显示数量改变  空瓶费)
                if (submitArr[mj].PRODUCT_DESC == "空瓶费") {

                  submitArr[mj].PO_QTY = submitArr[i].PO_QTY;
                }
              }

              for (var ij = 0; ij < self.data.giftList.length;ij++){

                // 雪花瓶装啤酒 (购物车显示数量改变  空瓶费)
                if (self.data.giftList[ij].PRODUCT_DESC == "空瓶费") {

                  number[self.data.giftList[ij].IDX] = parseInt(self.data.inputValue);
                }
              }
            }

            isRepeat = true;
          }
        }

        if (!isRepeat && self.data.inputValue != 0) {

          submitArr[submitArr.length] = self.data.giftList[self.data.inputNum];
          submitArr[submitArr.length - 1].PO_QTY = parseInt(self.data.inputValue);

          submitArr[submitArr.length - 1].SALE_REMARK = self.data.giftList[self.data.inputNum].PRODUCT_NAME + "分类赠品";
          submitArr[submitArr.length - 1].ORG_PRICE = self.data.giftList[self.data.inputNum].PRODUCT_PRICE;

          if (self.data.giftList[self.data.inputNum].PRODUCT_TYPE == "雪花瓶装啤酒") {

            for (var mn = 0; mn < self.data.giftList.length; mn++) {

              // 雪花瓶装啤酒 (空瓶费)
              if (self.data.giftList[mn].PRODUCT_DESC == "空瓶费") {

                submitArr[submitArr.length] = self.data.giftList[mn];
                submitArr[submitArr.length - 1].PO_QTY = parseInt(self.data.inputValue);

                submitArr[submitArr.length - 1].SALE_REMARK = self.data.giftList[mn].PRODUCT_NAME + "分类赠品";
                submitArr[submitArr.length - 1].ORG_PRICE = self.data.giftList[mn].PRODUCT_PRICE;
              }
            }
          }
        }

        //页面上number重新显示
        number[self.data.giftList[self.data.inputNum].IDX] = parseInt(self.data.inputValue);

        // 输入产品数量如果小于零，该物品在购物车中消失
        if (self.data.inputValue == 0) {

          for (var j = 0; j < submitArr.length; j++) {

            if (submitArr[j].IDX == self.data.giftList[self.data.inputNum].IDX) {

              submitArr.splice(j, 1);
            }
          }
        }

      } else if (self.data.element == '购物车') {

        // 产品总数量重新计算
        totalNum = parseInt(self.data.totalNum) - submitArr[self.data.inputNum].PO_QTY + parseInt(self.data.inputValue);

        //如果添加赠品数量超过可选数量，则提示信息出现
        isExcess(totalNum);

        if (excess) {
          return;
        }

        //剩余数量
        overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] = overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] + submitArr[self.data.inputNum].PO_QTY  - parseInt(self.data.inputValue);

        if (submitArr[self.data.inputNum].PRODUCT_TYPE == "雪花瓶装啤酒") {

          for (var jo = 0; jo < self.data.giftList.length; jo++) {

            // 雪花瓶装啤酒 (页面显示数量改变  空瓶费)
            if (self.data.giftList[jo].PRODUCT_DESC == "空瓶费") {

              number[self.data.giftList[jo].IDX] = parseInt(self.data.inputValue);
            }
          }
          for (var io = 0; io < submitArr.length; io++) {

            // 雪花瓶装啤酒 (购物车显示数量改变  空瓶费)
            if (submitArr[io].PRODUCT_DESC == "空瓶费") {

              submitArr[io].PO_QTY = parseInt(self.data.inputValue);
            }
          }
        }

        //页面上number重新显示
        number[submitArr[self.data.inputNum].IDX] = parseInt(self.data.inputValue);

        submitArr[self.data.inputNum].PO_QTY = parseInt(self.data.inputValue);

        // 输入产品数量如果小于零，该物品在购物车中消失
        if (self.data.inputValue == 0) {

          submitArr.splice(self.data.inputNum, 1);
        }
      }

    } else {   

      if (self.data.inputValue != 0) {

        totalNum = parseInt(self.data.inputValue);

        //如果添加赠品数量超过可选数量，则提示信息出现
        isExcess(totalNum);

        if (excess) {
          return;
        }

        //剩余数量
        overplus[self.data.GiftClasses[self.data.classSelectIdx].TYPE_NAME] -= parseInt(self.data.inputValue);

        submitArr[0] = self.data.giftList[self.data.inputNum];
        submitArr[0].PO_QTY = parseInt(self.data.inputValue);

        submitArr[0].SALE_REMARK = self.data.giftList[self.data.inputNum].PRODUCT_NAME + "分类赠品";
        submitArr[0].ORG_PRICE = self.data.giftList[self.data.inputNum].PRODUCT_PRICE;

        number[self.data.giftList[self.data.inputNum].IDX] = parseInt(self.data.inputValue);

        if (self.data.giftList[self.data.inputNum].PRODUCT_TYPE == "雪花瓶装啤酒") {

          for (var jo = 0; jo < self.data.giftList.length; jo++) {

            // 雪花瓶装啤酒 (购物车显示数量改变  空瓶费)
            if (self.data.giftList[jo].PRODUCT_DESC == "空瓶费") {

              submitArr[1] = self.data.giftList[jo];
              submitArr[1].PO_QTY = parseInt(self.data.inputValue);

              submitArr[1].SALE_REMARK = self.data.giftList[jo].PRODUCT_NAME + "分类赠品";
              submitArr[1].ORG_PRICE = self.data.giftList[jo].PRODUCT_PRICE;

              number[self.data.giftList[jo].IDX] = parseInt(self.data.inputValue);
            }
          }
        }
      }
    }
    
    this.setData({
      isHidden: 'none',
      number: number,
      submitArr: submitArr,
      totalNum: totalNum,
      overplus: overplus
    })
  },
  //显示  输入产品数量输入框
  "entryShow": function (e) {

    var self = this;

    if (e.currentTarget.dataset.element == '页面') {

      self.setData({
        element: "页面"
      })

      // 雪花瓶装啤酒 (空瓶费)
      if (self.data.giftList[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

        return;

      } 
    } else if (e.currentTarget.dataset.element == '购物车') {

      self.setData({
        element: "购物车"
      })

      // 雪花瓶装啤酒 (空瓶费)
      if (self.data.submitArr[e.currentTarget.id].PRODUCT_DESC == "空瓶费") {

        return;

      }
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