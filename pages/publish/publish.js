const app = getApp()

import { q } from '../../config/q'
import { getMyLogistic, addLogistic } from '../../config/api'

Page({
    data: {
        text: ''
    },

    onLoad(options) { 
        wx.setNavigationBarTitle({
            title: '发布货源'
        })
        q({
            url: getMyLogistic,
            header: {
              authorization: app.globalData.token,
            },
        }).then(d => {
            this.setData({
                text: d.data.data.content
            })
        })
    },
  
    inputs(e) {
        this.setData({
            text: e.detail.value,
        })
    },

    clear() {
        this.setData({
            text: ''
        })
    },

    sub() {
        q({
            url: addLogistic,
            method: 'post',
            header: {
                authorization: app.globalData.token
            },
            data: {
                content: this.data.text,
            }
        }).then(d => {
            console.log(d)
            // wx.showToast({
            //     title: '提交成功',
            //     icon: 'none', //- "success", "loading", "none"
            //     duration: 1000,
            //     mask: false,
            //     success: (res) => {
            //         wx.navigateTo({
            //             url: '/pages/index/index'
            //         })
            //     }
            // })
        })
    }
})