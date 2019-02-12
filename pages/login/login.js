// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   * 
   * 
   */
  data: {
    typeList: [],
    typeHidden:"none",
    userName:'',
    password:'',
    tagContent:"",//提示信息内容
    tagHidden: "none",//提示信息是否出现
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self=this;

    wx.getStorage({
      key: 'userLogin',
      success: function (res) {
        getApp().globalData.userName = res.data.userName;
        getApp().globalData.password = res.data.password;

        self.setData({
          userName: res.data.userName,
          password: res.data.password
        })
      }
    })
  },
  "typeCancle":function(){
    this.setData({
      typeHidden: "none"
    })
  },
  "getUserName":function(e){
   
    this.setData({
      userName:e.detail.value
    })
  },
  "getPassWord":function(e){
    this.setData({
      password: e.detail.value
    })
  },
  "login":function(e){
    
    var self = this ;


    var globalData = getApp().globalData;

    var typeContent = this.data.typeList[e.target.id]
  
    // 改变全局变量
    globalData.BUSINESS_IDX = typeContent.BUSINESS_IDX;
    globalData.BUSINESS_CODE = typeContent.BUSINESS_CODE;
    globalData.BUSINESS_NAME = typeContent.BUSINESS_NAME;


    // 跳转到首页
    wx.reLaunch({
      url: '../index/index'
    })

  },
  "toReg":function(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  "type-select":function(){

    var self = this;

    // 获取全局变量
    var globalData = getApp().globalData;
    
    // 验证用户名密码

    // 用户名为空
  if(!self.data.userName){
    self.setData({
      tagHidden:'block',
      tagContent:"请输入用户名"
    })
    setTimeout(function(){
      self.setData({
        tagHidden: 'none'
      })
    },2000)
    return;

    // 密码为空
  }else if(!self.data.password){
    self.setData({
      tagHidden: 'block',
      tagContent: "请输入密码"
    })

    setTimeout(function () {
      self.setData({
        tagHidden: 'none'
      })
    }, 2000)

    return;
  }else{
    //缓存条
    wx.showLoading({
      title: '正在加载',
    })

    // 发送请求
    wx.request({
      url: "https://tms.kaidongyuan.com/api/Login",
      method: "POST",
      data: {
        "strUserName": self.data.userName,
        "strPassword": self.data.password,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();

        if (res.data.type == "1") {

          wx.setStorage({
            key: "userLogin",
            data: {
              userName: self.data.userName,
              password: self.data.password
            }
          })

          globalData.IDX = res.data.result[0].IDX;
          globalData.USER_NAME = res.data.result[0].USER_NAME;
          globalData.USER_TYPE = res.data.result[0].USER_TYPE;

          // 发送类型请求
          wx.request({
            url: "https://tms.kaidongyuan.com/api/GetBuisnessList",
            method: 'POST',
            data: {
              "strUserIdx": res.data.result[0].IDX,
              "strLicense": ''
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              self.setData({
                typeList: res.data.result
              })
            }
          })
          self.setData({
            typeHidden: "block"
          })
        } else {
          if (res.data.msg){
            self.setData({
              tagHidden: 'block',
              tagContent: res.data.msg
            })
            setTimeout(function () {
              self.setData({
                tagHidden: 'none'
              })
            }, 2000)
          }else{
            self.setData({
              tagHidden: 'block',
              tagContent:"登录失败"
            })
            setTimeout(function () {
              self.setData({
                tagHidden: 'none'
              })
            }, 2000)
          }
         
        }

      }
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