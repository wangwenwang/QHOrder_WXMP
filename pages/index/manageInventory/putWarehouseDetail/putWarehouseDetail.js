// pages/index/manageInventory/putWarehouseDetail/putWarehouseDetail.js
var utils=require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    nullHidden:"none",
    loadPage:1, //加载页数
    isFinished:0, //数据是否加载完了
  },
  "toPutDetails":function(e){
    if (this.data.dataList[e.currentTarget.id].INPUT_WORKFLOW == "新建" && this.data.dataList[e.currentTarget.id].INPUT_STATE == "OPEN"){
      var isPutBtn = "block";
    }else{
      var isPutBtn = "none";
    }

    wx.navigateTo({
      url: 'putDetails/putDetails?OutputIdx=' + this.data.dataList[e.currentTarget.id].IDX + "&isPutBtn=" + isPutBtn
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
    
    utils.http("GetInputList", data, this.callback)
  
  },
  callback: function (res){

    wx.hideLoading();
  
      var self = this;
      console.log(res)
      if (res.type == 1) {

        for (var i = 0; i < res.result.List.length; i++) {

          res.result.List[i].INPUT_QTY = parseInt(res.result.List[i].INPUT_QTY)

          if (res.result.List[i].INPUT_STATE == "CANCEL") {
            res.result.List[i].INPUT_WORKFLOW = "此入库单已取消"
          }

          if (res.result.List[i].INPUT_TYPE == "采购退库") {

            res.result.List[i].INPUT_TYPE_color = "red"

          } else {

            res.result.List[i].INPUT_TYPE_color = "green"

          }
          if (res.result.List[i].INPUT_WORKFLOW == "新建") {

            res.result.List[i].INPUT_WORKFLOW_color = "red"

          } else if (res.result.List[i].INPUT_WORKFLOW == "此入库单已取消") {

            res.result.List[i].INPUT_WORKFLOW_color = "#8B8B8D"

          } else {
            res.result.List[i].INPUT_WORKFLOW_color = "green"
          }
        }

        //判断是否能下拉刷新
        if (res.result.List.length < 20) {
          self.setData({
            isFinished: 1
          })
        } else {
          self.setData({
            isFinished: 0,
          })
        }
        //判断列表数组  加载后是否需要连接
        if (self.data.loadPage > 1) {
          self.setData({
            dataList: self.data.dataList.concat(res.result.List),
          })
        } else {
          self.setData({
            dataList: res.result.List,
          })
        }

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

    var self=this;

    if (getApp().globalData.putDetails == true){

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

      utils.http("GetInputList", data, this.callback)
  
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
       loadPage:1,
    })

    var data = {
      "BUSINESS_IDX": getApp().globalData.BUSINESS_IDX,
      "ADD_USER": self.data.ADD_USER,
      "strPage": '1',
      "strPageCount": '20',
      "strLicense": ''
    };

    utils.http("GetInputList", data, this.callback);
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

    var self =this;

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

    utils.http("GetInputList", data, this.callback)
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})