// pages/index/manageInventory/warehouseDetail/warehouseDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PRODUCT_NO: '', //产品编号
    PRODUCT_NAME: '', //产品名称
    STOCK_QTY:'', //库存数量
    STOCK_UOM:'', //库存数量的单位
    EDIT_DATE: '', //编辑时间
    Info:[],
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
  
  },
  "inAndOut":function(){
    wx.navigateTo({
      url: 'inAndOut/inAndOut?IDX='+this.data.IDX
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
      IDX: options.IDX
    })
    var self=this;
    var IDX = options.IDX;
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetStockNoList",
      method: "POST",
      data: {
        "IDX":IDX,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if(res.data.type==1){

          var List = res.data.result.List;
          for (var i = 0; i < res.data.result.Info.length; i++) {
            res.data.result.Info[i].STOCK_QTY = parseInt(res.data.result.Info[i].STOCK_QTY)
          }

          self.setData({
            PRODUCT_NO: List.PRODUCT_NO, //产品编号
            PRODUCT_NAME: List.PRODUCT_NAME, //产品名称
            STOCK_QTY: parseInt(List.STOCK_QTY), //库存数量
            STOCK_UOM: List.STOCK_UOM, //库存数量的单位
            EDIT_DATE: List.EDIT_DATE, //编辑时间
            Info: res.data.result.Info
          })

        }else{
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