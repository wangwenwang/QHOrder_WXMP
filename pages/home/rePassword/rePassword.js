// pages/home/rePassword/rePassword.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    oldpwd:"",
    newpwd:"",
    reNewpwd:"",
    tagContent:"",
    tagHidden:"none"
  },
  "getOldpwd":function(e){
    this.setData({
      oldpwd:e.detail.value
    })
  },
  "getNewpwd":function(e){
    this.setData({
      newpwd: e.detail.value
    })
  },
  "getReNewpwd":function(e){
    this.setData({
      reNewpwd: e.detail.value
    })
  },
  "submit":function(){

    var self=this;

    var userName = getApp().globalData.userName;

    if (!this.data.oldpwd){
      self.setData({
        tagContent:"请输入原密码！",
        tagHidden:"block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    } else if (!this.data.newpwd){
      self.setData({
        tagContent: "请输入新密码！",
        tagHidden: "block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    } else if (!this.data.reNewpwd){
      self.setData({
        tagContent: "请确认新密码！",
        tagHidden: "block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    } else if (this.data.reNewpwd != this.data.newpwd){
      self.setData({
        tagContent: "两次新密码不一致！",
        tagHidden: "block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    } else if (this.data.newpwd.length<6){
      self.setData({
        tagContent: "密码不能小于6位数！",
        tagHidden: "block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;
    } else if (this.data.oldpwd == this.data.newpwd){
      self.setData({
        tagContent: "新密码不能与原密码相同！",
        tagHidden: "block"
      })
      setTimeout(function () {
        self.setData({
          tagHidden: 'none'
        })
      }, 2000)
      return;

    }else{
      //发送请求
    wx.request({
      url: "https://tms.kaidongyuan.com/api/modifyPassword",
      method: "POST",
      data: {
        "strUserName": userName,
        "strPassword": self.data.oldpwd,
        "strNewPassword": self.data.newpwd,
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        self.setData({
          tagContent: res.data.msg,
          tagHidden: "block"
        })

        if (res.data.type==1){
          
          setTimeout(function () {
            self.setData({
              tagHidden: 'none'
            })

            wx.setStorage({
              key: "userLogin",
              data: {
                userName: userName,
                password: ''
              }
            })
            wx.reLaunch({
              url: '../../login/login'
            })
          }, 2000)
        }else{
          setTimeout(function () {
            self.setData({
              tagHidden: 'none'
            })
        
          }, 2000)
        }
      }
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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