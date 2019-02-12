// pages/index/inventoryReg/customerList/addInventory/addInventory.js
const date = new Date()
const years = []
const months = []
const days = []

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
   * 页面的初始数据
   * 
   * 
   * strProductType: options.strProductType,//客户类型
   *    PARTY_CODE: options.PARTY_CODE,//客户代码
   *  PARTY_CITY: options.PARTY_CITY,//客户城市
   *   PARTY_NAME: options.PARTY_NAME,//客户名称
   */
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    year: date.getFullYear(),
    value: [9999, 1, 1],
    currentDate:'',
    goodsList:[],
    inventoryNumber:[],
    mbHidden:"none",
    inventoryMonth: '',
    textBorder:"1px solid #F28B31",
    tagHidden:"none",//标签是否显示
    tagContent: "",//提示标签内容
    //页面说明：当本页面没有得到数据时，预览页面是否还有提交按钮？等等。。
  },
  // 跳转到确认订单页面
  "toConfirmInfo":function(){
    // 1. 先判断库存数量有没有填写
    // 2. 再判断库存月份有没有填写
    // 3. 再判断生产日期有没有填写
    // if (this.data.inventoryMonth==''){

    // }
    // wx.navigateTo({
    //   url: 'confirmInfo/confirmInfo'
    // })
  },
  "jia":function(e){

    var inventoryNumber = this.data.inventoryNumber;
 
    inventoryNumber[e.currentTarget.id][inventoryNumber[e.currentTarget.id].length]=0;

    this.setData({
      inventoryNumber: inventoryNumber
    })
  },
  "jian":function(e){
    var inventoryNumber = this.data.inventoryNumber;

    if (inventoryNumber[e.currentTarget.id].length>1){

      inventoryNumber[e.currentTarget.id].length = inventoryNumber[e.currentTarget.id].length - 1;

      this.setData({
        inventoryNumber: inventoryNumber
      })
    }else{
      return;
    }
  },
  "monthSelect":function(){
    
    this.setData({
      mbHidden:'block',
    })
  },
  "cancel":function(){
    this.setData({
      mbHidden: 'none'
    })
  },
  "ensure": function () {
    var inventoryMonth = this.data.year + "年" + this.data.month + "月" + this.data.day + "日";
    this.setData({
      mbHidden: 'none',
      inventoryMonth: inventoryMonth,
      textBorder: "none"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self=this;

    self.setData({
      tagHidden: 'block',
      tagContent: '添加库存页面暂不开放'
    })
    // setTimeout(function () {
    //   self.setData({
    //     tagHidden: 'none'
    //   })
    // }, 2000)
    // var month = new Date().getMonth() + 1;

    // if((month+'').length=="1"){
    //   var currentDate = new Date().getFullYear() + "-0" + month + "-" + new Date().getDate();
    // }else{
    //   var currentDate = new Date().getFullYear() + "-" + month + "-" + new Date().getDate();
    // }
    // this.setData({
    //   currentDate: currentDate,
    //   options: options,
    // })
    

    // var strBusinessId = getApp().globalData.BUSINESS_IDX;

    // //请求列表信息
    // wx.request({
    //   url: "https://tms.kaidongyuan.com/api/GetProductListType",
    //   method: "POST",
    //   data: {
    //     "strBusinessId": strBusinessId,
    //     "strPartyIdx": options.strPartyIdx,
    //     "strPartyAddressIdx": options.strPartyAddressIdx,
    //     "strProductType": options.strProductType,
    //     "strProductClass": options.strProductClass,
    //     "strLicense": ''
    //   },
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
     
    //     if(res.data.type==1){

    //       var inventoryNumber = [];
    //       for (var i = 0; i < res.data.result.length; i++) {
    //         inventoryNumber[i] = [0];
    //       }
    //       self.setData({
    //         goodsList: res.data.result,
    //         inventoryNumber: inventoryNumber
    //       })

    //     }else{

    //       self.setData({
    //         tagHidden: 'block',
    //         tagContent: res.data.msg
    //       })
    //       setTimeout(function () {
    //         self.setData({
    //           tagHidden: 'none'
    //         })
    //       }, 2000)
    //     }
    //   }
    // })
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