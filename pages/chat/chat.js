//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    messages:[],
    inputMessage:'',
    userinfo:{}
  },
  onLoad: function () {
    let self = this
    self.setData({
      userinfo: app.globalData.userInfo
    })
    wx.connectSocket({
      url: 'ws://182.92.199.228:8080/chat',
      header:{
        cookie:wx.getStorageSync("cookie")
      },
      fail:function(res){
        wx.showToast({
          title: '进入房间失败',
          icon:"none"
        })
      }
    })
    wx.onSocketOpen(function(){
      wx.showToast({
        title: '连接成功',
      })
    }),
    wx.onSocketClose(function(){
      wx.showToast({
        title: '退出聊天',
      })
    }),
    wx.onSocketError(function(error){
      wx.showToast({
        title: error,
        icon:'none'
      })
    }),
    wx.onSocketMessage(function(res){
      let message=JSON.parse(res.data)
      self.data.messages.push(...message)
      self.setData({
        messages:self.data.messages
      })
    })
  },
  send:function(e){
    let self = this
    let message = { "from": self.data.userinfo.nickName,"to": "other","content":e.detail.value}
    wx.sendSocketMessage({
      data: JSON.stringify(message),
      success:function(){
        self.setData({
          inputMessage: ''
        })
        self.data.messages.push(message)
        self.setData({
          messages: self.data.messages
        })
      }
    })
  }
})
