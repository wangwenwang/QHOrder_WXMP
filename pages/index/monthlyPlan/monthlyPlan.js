// pages/index/monthlyPlan/monthlyPlan.js
var utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    typeHidden:true,
    animationData2:{},
    typeText:"新建",
    strState:'ZHENG', 
    loadPage:1, // 当前是第几页数据
    isFinished: 0, //上拉加载是否完成
    totalNum:0,//共计多少条记录
    dataState:"新建",//列表类型 
    isHaveData:true,//没有数据提示  是否显示
  },
  // 新建计划
  "newPlan":function(){
    wx.navigateTo({
      url: '../inventoryReg/customerList/customerList?monthlyPlan=monthlyPlan'
    })
  },
  // 新建
  "newBuilt":function(){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      typeText:"新建",
      strState: 'ZHENG',
      isFinished: 0,
      loadPage: 1
    })
    this.selectType();

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": "ZHENG",
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback)
  },
  // 已审核
  "checked": function () {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      typeText: "已审核",
      strState: 'SHENHE',
      isFinished: 0,
      loadPage: 1
    })
    this.selectType();

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": "SHENHE",
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback)
  },
  // 已取消
  "canceled": function () {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      typeText: "已取消",
      strState: 'CANCEL',
      isFinished: 0,
      loadPage:1
    })
    this.selectType();


    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": "CANCEL",
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback)
  },
  //页面跳转
  "toPlanDateil":function(e){
    wx.navigateTo({
      url: 'planDetail/planDetail?IDX=' + this.data.listData[e.currentTarget.id].IDX
    })

  },
  //数据类型选择
  "selectType":function(){

    var self=this;

    if (this.data.typeHidden){

      var height = 180 + "rpx";
      var rotate=180;

      self.setData({
        typeHidden:false
      })


    }else{

      var height = 0 ;
      var rotate = 0;

      self.setData({
        typeHidden: true
      })

    }
// 下拉功能
    var animation = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })

    animation.height(height).step()

    //旋转功能
    var animation2 = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })

    animation2.rotate(rotate).step()

    this.setData({
      animationData: animation.export(),
      animationData2: animation2.export(),
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

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": "ZHENG",
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback)
  
  },
  callback:function(res){

    wx.hideLoading();
    var self=this;
    
      if(res.type==1){
        // 处理计划月份字符串
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].REQUEST_ISSUE = res.result[i].REQUEST_ISSUE.substring(0, 7)
        }
        // 判断上拉加载是否完毕
        if (res.result.length < 20) {
          self.setData({
            isFinished: 1
          })
        } else {
          self.setData({
            isFinished: 0,
          })
        }
 //上拉加载后 数据拼接
        if (self.data.loadPage > 1) {
          self.setData({
            listData: self.data.listData.concat(res.result),
            totalNum: self.data.totalNum + res.result.length
          })

        } else {
          self.setData({
            listData: res.result,
            totalNum: res.result.length
          })
        }
        ////
        self.setData({
          isHaveData:true
        })
      }else{

        self.setData({
          isHaveData: false
        })
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

    var self = this;

    if (getApp().globalData.monthly == true) {

      //缓存条
      wx.showLoading({
        title: '正在加载',
      })

      this.setData({
        isFinished: 0,
        loadPage: 1,
      })

      var data = {
        "strUserId": getApp().globalData.IDX,
        "strPartyType": '',
        "strBusinessId": getApp().globalData.BUSINESS_IDX,
        "strPartyId": '',
        "strStartDate": '',
        "strEndDate": '',
        "strState": self.data.strState,
        "strPage": '1',
        "strPageCount": '20',
        "strLicense": ''
      };

      utils.http("GetOrderPlanList", data, self.callback);

      getApp().globalData.monthly = false;
    }
  
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


    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      loadPage:1
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": this.data.strState,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {


    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;

    if (self.data.isFinished){
      wx.hideLoading();
      return;
    }else{
      self.setData({
        loadPage: self.data.loadPage + 1,
      })
    }
    var data = {
      "strUserId": getApp().globalData.IDX,
      "strPartyType": '',
      "strBusinessId": getApp().globalData.BUSINESS_IDX,
      "strPartyId": '',
      "strStartDate": '',
      "strEndDate": '',
      "strState": self.data.strState,
      "strPage": self.data.loadPage,
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOrderPlanList", data, this.callback)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})