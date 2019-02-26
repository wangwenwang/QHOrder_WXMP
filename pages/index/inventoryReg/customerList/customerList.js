// pages/index/inventoryReg/customerList/customerList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    searchData:[],
    seleHidden:"none", //地址选择 弹出框是否显示
    addressList:[], //客户选择地址列表
    orderNum:0,//客户列表中选择了哪一个客户
    tagContent: "",//提示信息内容
    tagHidden: "none",//提示信息是否出现
  },
  "hidden":function(){
    this.setData({
      seleHidden: "none"
    })
  },
  //搜索功能
  "search":function(e){
    
    var listData = this.data.searchData;
    var reData = [];
    for (var i = 0; i < listData.length;i++){

      if (listData[i].PARTY_NAME.indexOf(e.detail.value)!=-1){

        reData[reData.length] = listData[i];
       
      }
    }
    this.setData({
      listData: reData
    })
  },
  //选择地址
  "toaddInventory":function(e){
    var self=this;
    this.setData({
      seleHidden: "none"
    })

    if (self.data.options.inventoryReg){
       //库存登记页面
      wx.navigateTo({
        url: 'addInventory/addInventory?strPartyIdx=' + self.data.listData[e.currentTarget.id].IDX + "&strPartyAddressIdx=" + self.data.addressList[e.currentTarget.id].IDX + "&strProductType=" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&strProductClass=" + self.data.listData[e.currentTarget.id].PARTY_CLASS + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&requestUrl=GetProductListType"
      })

    } else if (self.data.options.costBill){
      //费用账单页面(账单列表)
      wx.navigateTo({
        url: '../../billList/billList?strPartyIdx=' + self.data.listData[e.currentTarget.id].IDX + "&requestUrl=GetProductListType"
      })

    } else if (self.data.options.manageInventory) {
      //库存管理页面
    
      wx.navigateTo({
        url: '../../manageInventory/manageInventory?ADDRESS_IDX=' + self.data.addressList[e.currentTarget.id].IDX + "&PARTY_TYPE" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&CONTACT_PERSON=" + self.data.addressList[e.currentTarget.id].CONTACT_PERSON + "&ADDRESS_CODE=" + self.data.addressList[e.currentTarget.id].ADDRESS_CODE + "&ADDRESS_INFO=" + self.data.addressList[e.currentTarget.id].ADDRESS_INFO + "&strPartyIdx=" + self.data.listData[e.currentTarget.id].strPartyIdx + "&requestUrl=GetProductListType"
      })

    } else if (self.data.options.monthlyPlan){
      //新建计划  跳转到选择商品页面（下单）
      wx.navigateTo({
        url: '../../../order/selectGoods/selectGoods?strPartyIdx=' + self.data.listData[self.data.orderNum].IDX + '&strPartyAddressIdx=' + self.data.addressList[e.currentTarget.id].IDX + '&PARTY_NAME=' + self.data.listData[self.data.orderNum].PARTY_NAME + '&CONTACT_PERSON=' + self.data.addressList[e.currentTarget.id].CONTACT_PERSON + '&CONTACT_TEL=' + self.data.addressList[e.currentTarget.id].CONTACT_TEL + '&ADDRESS_INFO=' + self.data.addressList[e.currentTarget.id].ADDRESS_INFO + "&monthlyPlan=monthlyPlan" + "&requestUrl=GetProductListType" + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_TYPE" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&ADDRESS_CODE=" + self.data.addressList[e.currentTarget.id].ADDRESS_CODE
      })
    }
    
  },
  "addInventory":function(e){
    var self=this;
    
    var strUserId = getApp().globalData.IDX;
    //请求对应客户的客户地址列表
    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetAddress",
      method: "POST",
      data: {
        "strUserId": strUserId,
        "strPartyId": self.data.listData[e.currentTarget.id].IDX,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        if (res.data.type == 1) {

          if (res.data.result.length == 1) {

            if (self.data.options.inventoryReg) {
              //库存登记页面
              wx.navigateTo({
                url: 'addInventory/addInventory?strPartyIdx=' + self.data.listData[e.currentTarget.id].IDX + "&strPartyAddressIdx=" + res.data.result[0].IDX + "&strProductType=" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&strProductClass=" + self.data.listData[e.currentTarget.id].PARTY_CLASS + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&requestUrl=GetProductListType"
              })
            } else if (self.data.options.costBill) {
              //费用账单页面(账单列表)
              wx.navigateTo({
                url: '../../billList/billList?strPartyIdx=' + self.data.listData[e.currentTarget.id].IDX + "&requestUrl=GetProductListType"
              })

            } else if (self.data.options.manageInventory) {
              //库存管理页面
              wx.navigateTo({
                url: '../../manageInventory/manageInventory?ADDRESS_IDX=' + res.data.result[0].IDX + "&PARTY_TYPE=" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&CONTACT_PERSON=" + res.data.result[0].CONTACT_PERSON + "&ADDRESS_CODE=" + res.data.result[0].ADDRESS_CODE + "&ADDRESS_INFO=" + res.data.result[0].ADDRESS_INFO + "&strPartyIdx=" + self.data.listData[e.currentTarget.id].strPartyIdx + "&requestUrl=GetProductListType"
              })

            } else if (self.data.options.monthlyPlan) {
              //新建计划  跳转到选择商品页面（下单）
              wx.navigateTo({
                url: '../../../order/selectGoods/selectGoods?strPartyIdx=' + self.data.listData[e.currentTarget.id].IDX + '&strPartyAddressIdx=' + res.data.result[0].IDX + '&PARTY_NAME=' + self.data.listData[e.currentTarget.id].PARTY_NAME + '&CONTACT_PERSON=' + res.data.result[0].CONTACT_PERSON + '&CONTACT_TEL=' + res.data.result[0].CONTACT_TEL + '&ADDRESS_INFO=' + res.data.result[0].ADDRESS_INFO + "&monthlyPlan=monthlyPlan" + "&requestUrl=GetProductListType" + "&PARTY_TYPE=" + self.data.listData[e.currentTarget.id].PARTY_TYPE + "&PARTY_CODE=" + self.data.listData[e.currentTarget.id].PARTY_CODE + "&PARTY_CITY=" + self.data.listData[e.currentTarget.id].PARTY_CITY + "&PARTY_NAME=" + self.data.listData[e.currentTarget.id].PARTY_NAME + "&ADDRESS_CODE=" + res.data.result[0].ADDRESS_CODE 
              })
            }
          } else if (res.data.result.length > 1) {
            self.setData({
              seleHidden: "block",
              addressList: res.data.result,
              orderNum: e.currentTarget.id
            })
          }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    //判断跳转时路由带过来的参数，判断是哪个页面跳转
   
    var self=this;

    var strUserId = getApp().globalData.IDX;
    var strBusinessId = getApp().globalData.BUSINESS_IDX;

    wx.request({
      url: "https://tms.kaidongyuan.com/api/GetPartyList",
      method: "POST",
      data: {
        "strUserId": strUserId,
        "strBusinessId": strBusinessId,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if(res.data.type==1){
          self.setData({
            listData: res.data.result,
            searchData: res.data.result,
            options: options
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