// pages/index/manageInventory/putWarehouseDetail/putDetails/putDetails.js
Page({

  /**
   * 页面的初始数据
   *  INPUT_NO: orderInfo.INPUT_NO, //入库订单号
      OUTPUT_NO: orderInfo.OUTPUT_NO, //原单出库单号
      ADD_DATE: orderInfo.ADD_DATE, //制单时间
      SUPPLIER_NAME: orderInfo.SUPPLIER_NAME, //供应商
      ADDRESS_INFO: orderInfo.ADDRESS_INFO, //起始地点
      ADDRESS_NAME: orderInfo.ADDRESS_NAME, //客户名称
      SUPPLIER_ADDRESS: orderInfo.SUPPLIER_ADDRESS, //目的地址
      INPUT_QTY: parseInt(orderInfo.INPUT_QTY), //数量
      INPUT_WEIGHT: orderInfo.INPUT_WEIGHT, //重量
      INPUT_VOLUME: orderInfo.INPUT_VOLUME, //体积
      IDX: orderInfo.IDX
   */
  data: {
    orderInfo: {},
    List:[],
    isBtnHidden:'none',
    tagContent:"", //提示信息
    tagHidden:"none", //提示信息 是否显示
    passParameter:"20"
  },
  //确认入库事件
  "confirm":function(){
    var self=this;
    
    wx.request({
      url: "http://oms.kaidongyuan.com:8088/api/InPutWorkflow",
      method: "POST",
      data: {
        "Input_idx": self.data.orderInfo.IDX,
        "ADUT_USER": getApp().globalData.USER_NAME,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       
        self.setData({
          tagHidden:"block",
          tagContent: res.data.msg
        })
        setTimeout(function () {
          self.setData({
            tagHidden: 'none'
          })
          getApp().globalData.putDetails=true;
          wx.navigateBack({
            delta: 1
          })                                                                                                                   
        }, 2000)
      }
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

    var self=this;
 
    this.setData({
      isBtnHidden: options.isPutBtn
    })
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetInputInfo",
      method: "POST",
      data: {
        "OutputIdx": options.OutputIdx,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();
       
        if (res.data.type == 1) {
          var orderInfo = res.data.result.Info;
          var goodsList = res.data.result.List;
          orderInfo.INPUT_WEIGHT = Math.round(orderInfo.INPUT_WEIGHT * 100) / 100;
          orderInfo.INPUT_VOLUME = Math.round(orderInfo.INPUT_VOLUME * 100) / 100;

          for (var i = 0; i < res.data.result.List.length; i++) {
            goodsList[i].INPUT_QTY = parseInt(goodsList[i].INPUT_QTY);
            goodsList[i].PRICE = parseInt(goodsList[i].PRICE);
            goodsList[i].SUM = parseInt(goodsList[i].SUM);
          }

          self.setData({
            List: res.data.result.List,
            orderInfo: orderInfo,
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