// pages/index/viewReport/viewReport.js
var Charts = require('../../../lib/js/chart.js');
var utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeHidden:"none",
    reportSelect:"客户报表",
    chartSelect:"圆饼分析图",
    tagHidden: 'none',//提示信息是否出现
    allHidden:"block"
  },
  //选择圆饼分析图
  "cakeChart":function(){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self = this;
    this.setData({
      chartSelect: "圆饼分析图"
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    if (this.data.reportSelect == "产品报表") {

      utils.http("ProductCount", data, self.ProductRing)

    } else if (this.data.reportSelect == "客户报表") {

      utils.http("CustomerCount", data, self.CustomerRing)
    }
  },
  //选择条形统计图
  "pillarChart":function(){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;

    this.setData({
      chartSelect: "条形统计图"
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    if (this.data.reportSelect=="产品报表"){

      utils.http("ProductCount", data, self.ProductColumn)
    
    } else if (this.data.reportSelect == "客户报表"){

      utils.http("CustomerCount", data, self.CustomerColumn)

    }
  },
//选择了客户报表
  "customerReport":function(){

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;

    this.setData({
      typeHidden: "none",
      reportSelect: "客户报表",
      allHidden:"block"
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    if (self.data.chartSelect=="圆饼分析图"){
      
      utils.http("CustomerCount", data, self.CustomerRing)

    } else if (this.data.chartSelect == "条形统计图"){

      utils.http("CustomerCount", data, self.CustomerColumn)
    }
  },
  //客户报表 圆饼分析图
  "CustomerRing": function (res) {

    wx.hideLoading();

    var self = this;
    if (res.type == 1) {

      var series = [];

      for (var i = 0; i < res.result.length; i++) {
        series[i] = {
          name: res.result[i].TO_CITY,
          data: parseInt(res.result[i].ORD_QTY),
          stroke: false

        };
      }
      new Charts({
        animation: true, //是否有动画
        canvasId: 'lineCanvas',
        subtitle: {
          name: '客户销量统计',
          color: '#666666',
          fontSize: 15
        },
        type: 'ring',
        series: series,
        width: 380,
        height: 500,
        dataLabel: true,
      });

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
  // 客户报表 条形统计图
  "CustomerColumn":function(res){

    wx.hideLoading();

    var self = this;
    if (res.type == 1) {

      var series = [], categories = [];

      for (var i = 0; i < res.result.length; i++) {
        categories[i] = res.result[i].TO_CITY;
        series[i] = parseInt(res.result[i].ORD_QTY)

      }
      new Charts({
        animation: true, //是否有动画
        canvasId: 'lineCanvas',
        type: 'column',
        categories: categories,
        series: [{
          name: "客户报表",
          data: series
        }],
        yAxis: {
          format: function (val) {
            return val;
          },
          min: 0
        },

        extra: {
          column: {
            width: 20
          }
        },
        width: 1000,
        height: 500,
        dataLabel: false

      });
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
  //选择了产品报表
  "productReport":function(){
    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    var self=this;
    this.setData({
      typeHidden: "none",
      reportSelect: "产品报表",
      allHidden:"block"
    })

    var data = {
      "strUserId": getApp().globalData.IDX,
      "strLicense": ''
    };

    if (self.data.chartSelect == "圆饼分析图"){

      utils.http("ProductCount", data, self.ProductRing)

    } else if (self.data.chartSelect == "条形统计图"){

      utils.http("ProductCount", data, self.ProductColumn)
    }
  },
  //产品报表  圆饼分析图
  "ProductRing":function(res){

    wx.hideLoading();

    var self = this;
    if (res.type == 1) {

      var series = [];

      for (var i = 0; i < res.result.length; i++) {
        series[i] = {
          name: res.result[i].PRODUCT_NAME,
          data: parseInt(res.result[i].PO_QTY),
          stroke: false

        };
      }
      new Charts({
        animation: true, //是否有动画
        canvasId: 'lineCanvas',
        subtitle: {
          name: '产品销量统计',
          color: '#666666',
          fontSize: 15
        },
        type: 'ring',
        series: series,
        width: 380,
        height: 500,
        dataLabel: true,
      });

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
  // 产品列表  条形统计图
  "ProductColumn":function(res){

    wx.hideLoading();
    
    var self = this;
    if (res.type == 1) {

      var series = [], categories = [];

      for (var i = 0; i < res.result.length; i++) {
        categories[i] = res.result[i].PRODUCT_NAME;
        series[i] = parseInt(res.result[i].PO_QTY)
      }
      new Charts({
        animation: true, //是否有动画
        canvasId: 'lineCanvas',
        type: 'column',
        categories: categories,
        series: [{
          name: "产品报表",
          data: series
        }],
        yAxis: {
          format: function (val) {
            return val;
          },
          min: 0
        },
        extra: {
          column: {
            width: 20
          }
        },
        width: 1500,
        height: 500,
        dataLabel: false
      });
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
  //报表选择  弹出框出现
  "typeShow":function(){
    this.setData({
      typeHidden: "block",
      allHidden:"none"
    })
  },
  //报表类型选择  取消按钮
  "typeCancel":function(){
    this.setData({
      typeHidden:"none",
      allHidden:"block"
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
      "strLicense": ''
    };

    utils.http("CustomerCount", data, this.CustomerRing)
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