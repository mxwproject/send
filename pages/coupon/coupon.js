// pages/coupon/coupon.js

const app = getApp()

import { q } from '../../config/q'
import { getVoucherList } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [
      // {
      //   amount: 1000,
      //   expiry: '2018.09.01',
      //   status: 1
      // },
      // {
      //   amount: 2000,
      //   expiry: '2018.09.01',
      //   state: 2
      // },
      // {
      //   amount: 1000,
      //   expiry: '2018.09.01',
      //   state: 3
      // }
    ],
    activeCouponBg: '../../static/imgs/coupon/active-coupon.png',
    empty: false,
    limited_voucher: [],
    unlimited_voucher: [],
    orderId: '',
    price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var {orderId, price} = options;
    this.setData({
      orderId: orderId,
      price: price,
    })
    wx.setNavigationBarTitle({
      title: '优惠券',
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
    this.getVoucherList();
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
  
  },

  getVoucherList() {
    q({
      url: getVoucherList,
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      let { limited_voucher, unlimited_voucher } = res.data.data;
      if(!limited_voucher.length && !unlimited_voucher.length) {
        this.setData({
          empty: true,
        })
      }else {
        limited_voucher = limited_voucher.map(v => {
          return {
            id: v.id,
            money: v.money,
            endtime: this.formatTime(v.end_time * 1000),
          }
        })
        this.setData({
          empty: false,
          limited_voucher: limited_voucher,
          unlimited_voucher: unlimited_voucher,
        })
      }
    })
  },

  formatTime(timestramp) {
    var ts = new Date(timestramp);
    var year = ts.getFullYear();
    var month = ts.getMonth() + 1;
    var date = ts.getDate();
    return `${year}-${month}-${date}`;
  },

  backToMakeorder(e) {
    var { id, money } = e.currentTarget.dataset;
    if(!this.data.orderId) {
      return;
    }
    wx.navigateTo({
      url: `/pages/makeorder/makeorder?orderId=${this.data.orderId}&price=${this.data.price}&couponId=${id}&money=${money}`,
    })
  }
})