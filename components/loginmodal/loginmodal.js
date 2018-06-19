// components/loginmodal/loginmodal.js

const app = getApp()

import { q } from '../../config/q'
import { getSendCode, bindMobile } from '../../config/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    phone: '',
    code: '',
    count: 60,
    captchaFlag: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {

    },
    getSendCode() {
      if(this.data.phone == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none', // "success", "loading", "none"
        })
        return;
      }
      q({
        url: getSendCode,
        method: 'post',
        data: {
          mobile: this.data.phone
        }
      }).then(res => {
        wx.showToast({
          title: '发送成功',
          icon: 'none', // "success", "loading", "none"
        })
        this.setData({
          captchaFlag: false,
        })
        this.coutdown();
      })
    },
    coutdown() {
      var _captchaTimer = setInterval(() => {
        var count = this.data.count;
        this.setData({
          count: count - 1
        })
        if (this.data.count == 0) {
          clearInterval(_captchaTimer);
          this.setData({
            captchaFlag: false,
            count: 60,
          })
        }
      }, 1000);
    },
    handlePhoneInput(e) {
      this.setData({
        phone: e.detail.value,
      })
    },
    handleCodeInput(e) {
      this.setData({
        code: e.detail.value,
      })
    },
    bindMobile() {
      q({
        url: bindMobile,
        method: 'post',
        data: {
          mobile: this.data.phone,
          code: this.data.code,
        }
      }).then(res => {
        wx.showToast({
          title: '绑定成功',
          icon: 'none', // "success", "loading", "none"
        })
      })
    }
  }
})
