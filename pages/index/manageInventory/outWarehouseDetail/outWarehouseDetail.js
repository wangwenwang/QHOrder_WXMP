// pages/index/manageInventory/outWarehouseDetail/outWarehouseDetail.js
var utils = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    nullHidden: "none",
    loadPage: 1, //加载页数
    isFinished: 0, //数据是否加载完了
  },
  "toPutDetails": function (e) {
    var self=this;
    if (self.data.dataList[e.currentTarget.id].OUTPUT_WORKFLOW_passOn == "新建" && self.data.dataList[e.currentTarget.id].OUTPUT_STATE == "OPEN") {
      var isPutBtn = "block";
 
      if (self.data.dataList[e.currentTarget.id].OUTPUT_TYPE_passOn =="出库退库"){
       
        wx.navigateTo({
          url: 'outDetails/outDetails?OutputIdx=' + this.data.dataList[e.currentTarget.id].IDX + "&isPutBtn=block&cancelOut=取消此单&confirmOut=确认已退货"
        })
        return;
      }
    } else {
      var isPutBtn = "none";
    }
    wx.navigateTo({
      url: 'outDetails/outDetails?OutputIdx=' + this.data.dataList[e.currentTarget.id].IDX + "&isPutBtn=" + isPutBtn
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
      ADD_USER: options.ADDRESS_IDX
    })
   
    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADD_USER": options.ADDRESS_IDX,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOupputList", data, this.callback)
  },
  callback: function (res) {

    wx.hideLoading();

    var self = this;

    if (res.type == 1) {

      for (var i = 0; i < res.result.List.length; i++) {

        res.result.List[i].OUTPUT_QTY = parseInt(res.result.List[i].OUTPUT_QTY);
        res.result.List[i].OUTPUT_TYPE_passOn = res.result.List[i].OUTPUT_TYPE;
        res.result.List[i].OUTPUT_WORKFLOW_passOn = res.result.List[i].OUTPUT_WORKFLOW;

        //上面的  判断颜色 
        if (res.result.List[i].OUTPUT_TYPE == "销售出库") {

          res.result.List[i].OUTPUT_TYPE_color = "green"

        } else if (res.result.List[i].OUTPUT_TYPE == "其它出库") {

          res.result.List[i].OUTPUT_TYPE_color = "red"

        } else if (res.result.List[i].OUTPUT_TYPE == "出库退库") {

          res.result.List[i].OUTPUT_TYPE_color = "#8B8B8D"

        }
        // //下面的 判断颜色和文字
        if (res.result.List[i].OUTPUT_STATE == "CANCEL") {
          res.result.List[i].OUTPUT_WORKFLOW = "此出库单已取消"
        }
        if (res.result.List[i].OUTPUT_WORKFLOW == "此出库单已取消") {

          res.result.List[i].OUTPUT_WORKFLOW_color = "#8B8B8D";

        } else if (res.result.List[i].OUTPUT_WORKFLOW == "新建") {

          res.result.List[i].OUTPUT_WORKFLOW_color = "red";
          res.result.List[i].OUTPUT_WORKFLOW = "未确认";

        } else if (res.result.List[i].OUTPUT_WORKFLOW == null) {
          res.result.List[i].OUTPUT_WORKFLOW = '';
        } else {
          res.result.List[i].OUTPUT_WORKFLOW_color = "green";
          res.result.List[i].OUTPUT_WORKFLOW = "已确认";
        }
      }
      //////判断是否能下拉刷新
      if (res.result.List.length < 20) {
        self.setData({
          isFinished: 1
        })
      } else {
        self.setData({
          isFinished: 0,
        })
      }
      /////判断列表数组  加载后是否需要连接
      if (self.data.loadPage > 1) {
        self.setData({
          dataList: self.data.dataList.concat(res.result.List),

        })
      } else {
        self.setData({
          dataList: res.result.List,
        })
      }
      ////
      self.setData({
          nullHidden: "none"
        })

    } else {
      self.setData({
        nullHidden: "block"
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

    if (getApp().globalData.putDetails == true) {

      //缓存条
      wx.showLoading({
        title: '正在加载',
      })

      this.setData({
        isFinished: 0,
        loadPage: 1,
      
      })

      var data = {
        "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
        "ADD_USER": self.data.ADD_USER,
        "strPage": '1',
        "strPageCount": '20',
        "strLicense": ''
      };

      utils.http("GetOupputList", data, this.callback)

      getApp().globalData.putDetails = false;
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

    var self = this;

    this.setData({
      loadPage: 1,
    })

    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADD_USER": self.data.ADD_USER,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOupputList", data, this.callback);
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
    
    var self = this;

    if (self.data.isFinished) {
      wx.hideLoading();
      return;
    }else{
      self.setData({
        loadPage: self.data.loadPage + 1,
      })
    }

    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADD_USER": self.data.ADD_USER,
      "strPage": self.data.loadPage,
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetOupputList", data, this.callback)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})