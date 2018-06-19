//app.js

import { wechatLogin } from './config/api.js'
import { q } from './config/q'

App({
  onLaunch: function () {
    this.checkUpdate();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var token = wx.getStorageSync('token');
        var tokenSetTime = wx.getStorageSync('tokenSetTime');
        // this.wechatLogin(res.code);
        if(!token) {
          this.wechatLogin(res.code);
        }else {
          // 验证token有效期
          let now = new Date().getTime();
          let setTime = tokenSetTime.getTime();
          let dvalue = parseInt(Math.abs(now - setTime)/1000/60/60/24);
          if(dvalue > 13) {
            try {
                wx.clearStorageSync()
            } catch(e) {
                
            }
            this.wechatLogin(res.code);
          }else {
            this.globalData.token = token;
          }
        }
      }
    })
  },
  checkUpdate() {

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },

  wechatLogin(code) {
    q({
      url: wechatLogin,
      method: 'post',
      data: {
        code: code
      }
    }).then(res => {
      let token = res.data.data.token;
      this.globalData.token = token;
      try {
          wx.setStorageSync('token', token);
          wx.setStorageSync('tokenSetTime', new Date());
      } catch (e) {
          
      }
    })
  },

  globalData: {
    userInfo: null,
    imageBase: 'http://i.uu-club.com',
    globalCategory: 'long',  // 为了解决 switchTab 无法传参的问题
    token: '',
  },
})