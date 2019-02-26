// pages/search/orderDetail/logisticsInfo/line/line.js

//提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
var coordtransform = require('../../../../../lib/js/coordtransform.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    polyline: [], //路线
    tagContent: "",
    tagHidden: "none",
    markers: [],
    latitude: '',//纬度
    longitude: '',//经度
    rgcData: {}
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
      url: "https://tms.kaidongyuan.com/api/GetLocaltion",
      method: "POST",
      data: {
        "strOrderId": options.ORD_IDX,
        "UUID": 'ios',
        "strLicense": ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.type == 1) {


          var gcj02tobd09;

          var points = [], subPoints = [], markers = self.data.markers;

          for (var i = 0; i < res.data.result.length; i++) {

            points[i] = {
              longitude: res.data.result[i].CORDINATEX,
              latitude: res.data.result[i].CORDINATEY,
            }

            gcj02tobd09 = coordtransform.bd09togcj02(points[i].longitude, points[i].latitude);
            subPoints[i] = {
              latitude: gcj02tobd09[1],
              longitude: gcj02tobd09[0],
            }

          }

          markers[0] = {
            latitude: subPoints[0].latitude,
            longitude: subPoints[0].longitude,
            iconPath: "/lib/image/start.png",
            id: 0,
            width:50,
            height:50,
          };
          markers[1] = {
            latitude: subPoints[subPoints.length-1].latitude,
            longitude: subPoints[subPoints.length - 1].longitude,
            iconPath: "/lib/image/over.png",
            id: 1,
            width:50,
            height:50,
          };
          self.setData({
            markers: markers,//标记 起点和终点
            latitude: subPoints[0].latitude,
            longitude: subPoints[0].longitude
          })

          wx.request({
            url: "https://apis.map.qq.com/ws/direction/v1/driving",
            method: "GET",
            data: {
              "from": subPoints[0].latitude + ',' + subPoints[0].longitude,
              "to": subPoints[subPoints.length - 1].latitude + ',' + subPoints[subPoints.length - 1].longitude,
              "output": 'json',
              "callback": 'cb',
              'key': 'RK3BZ-3HTWR-WTDWB-WOPRZ-RFWEO-3OF4L'
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)

              if (res.data.status == 0) {

                var subPoint = res.data.result.routes[0].polyline;

                for (var i = 2; i < subPoint.length; i++) {

                  subPoint[i] = subPoint[i - 2] + subPoint[i] / 1000000;

                }

                var subLine = [];

                for (var j = 0; j < subPoint.length; j += 2) {

                  subLine[subLine.length] = {
                    latitude: subPoint[j],
                    longitude: subPoint[j + 1],
                  }
                }

                self.setData({
                  polyline: [{
                    points: subLine,
                    color: "#FF0000",
                    width: 2
                  }],
                });

              } else {
                self.setData({
                  tagHidden: 'block',
                  tagContent: "获取线路失败"
                })
                setTimeout(function () {
                  self.setData({
                    tagHidden: 'none'
                  })
                }, 2000)
              }
            }
          })

        } else {
          self.setData({
            tagHidden: 'block',
            tagContent: "获取线路失败"
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