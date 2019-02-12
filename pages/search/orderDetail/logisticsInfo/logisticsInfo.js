 // pages/search/orderDetail/logisticsInfo/logisticsInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    ORD_TO_NAME:'', //客户名称
    ORD_TO_ADDRESS:'', //目的地址
    ORD_QTY:'', //下单总量
    ORD_WEIGHT:'',  //下单总重
    ORD_VOLUME:'', //下单体积
    TMS_QTY:'',  //发货总量
    TMS_WEIGHT:'', //发货重量
    TMS_VOLUME:'', //发货体积
    TmsList:'', //原单/拆单数组
    idx:'',
    tagHidden: "none",//提示信息是否显示
    tagContent: "",//提示信息内容
  },
  //跳转到 物流信息详情 页面
  "tologisticsDetail":function(e){
    var self=this;
    wx.navigateTo({
      url: 'logisticsDetail/logisticsDetail?TmsList=' + self.data.TmsList[e.currentTarget.id].ORD_IDX
    })
  },
  //跳转到 查看进度 页面
  "toProgress":function(e){
    var self = this;
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'progress/progress?TmsList=' + self.data.TmsList[e.currentTarget.id].ORD_IDX
    })
  },
  //跳转到 查看路线 页面
  "toLine": function (e) {
    var self = this;
    wx.navigateTo({
      url: 'line/line?ORD_IDX=' + self.data.TmsList[e.currentTarget.id].ORD_IDX
    })
  },
  'toSign':function(e){
    var self = this;

    if (self.data.TmsList[e.currentTarget.id].sign){
      wx.navigateTo({
        url: 'sign/sign?ORD_IDX=' + self.data.TmsList[e.currentTarget.id].ORD_IDX
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    //缓存条
    wx.showLoading({
      title: '正在加载',
    })
    
    var self = this;

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetOrderTmsList",
      method: "POST",
      data: {
        "strOrderId": options.strOrderId,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();
     
        if (res.data.type==1){

          var resultData = res.data.result[0];

          if (resultData.TmsList.length) {

            for (var j = 0; j < resultData.TmsList.length; j++) {

              resultData.TmsList[j].ORD_ISSUE_QTY = parseInt(resultData.TmsList[j].ORD_ISSUE_QTY);

              var ORD_WORKFLOW = resultData.TmsList[j].ORD_WORKFLOW;

              if (ORD_WORKFLOW == '新建') {

                resultData.TmsList[j].ORD_WORKFLOW = '已接受';

              } else if (ORD_WORKFLOW == '已释放') {

                resultData.TmsList[j].ORD_WORKFLOW = '待装车';

              } else if (ORD_WORKFLOW == '已确定') {

                resultData.TmsList[j].ORD_WORKFLOW = '已拼车';

              } else if (ORD_WORKFLOW == '已回单') {

                resultData.TmsList[j].ORD_WORKFLOW = '已完结';

              }

              if (resultData.TmsList[j].ORD_WORKFLOW == '已完结'){

                resultData.TmsList[j].sign = true;
              }else{
                resultData.TmsList[j].sign = false;
              }
            }
          }

          self.setData({
            ORD_TO_NAME: resultData.ORD_TO_NAME, //客户名称
            ORD_TO_ADDRESS: resultData.ORD_TO_ADDRESS, //目的地址
            ORD_QTY: parseInt(resultData.ORD_QTY), //下单总量
            ORD_WEIGHT: resultData.ORD_WEIGHT,  //下单总重
            ORD_VOLUME: resultData.ORD_VOLUME, //下单体积
            TMS_QTY: resultData.TMS_QTY,  //发货总量
            TMS_WEIGHT: resultData.TMS_WEIGHT, //发货重量
            TMS_VOLUME: resultData.TMS_VOLUME, //发货体积
            TmsList: resultData.TmsList,
            idx: resultData.IDX
          })

        }else{
          //未成功获取数据，提示信息出现
          self.setData({
            tagHidden: 'block',
            tagContent:res.data.msg
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