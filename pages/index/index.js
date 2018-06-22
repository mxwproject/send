//index.js
//获取应用实例
const app = getApp()

import { q } from '../../config/q'
import { getLogistics } from '../../config/api'

Page({
  data: {
    logistics: {},
    pageSize: 20,
    pageNo: 0,
  },

  onLoad: function () {
    this.getLogistics();
  },

  onReachBottom: function () {
    this.setData({
      pageNo: this.data.pageNo + 1,
    })
    this.getLogistics();
  },

  getLogistics() {
    let ps = this.data.pageSize || 20,
        pn = this.data.pageNo || 0;
    q({
      url: getLogistics(ps, pn)
    }).then(res => {
      let result = res.data.data.logistics.rows;
      this.setData({
        logistics: [...this.data.logistics, ...result]
      })
    })
  },

  onShareAppMessage: function () {
  
  },
})
