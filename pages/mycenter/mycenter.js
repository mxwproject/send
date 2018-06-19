// pages/mycenter/mycenter.js

const app = getApp()

import { q } from '../../config/q'
import { orderList, getVoucherList } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    editImg: '../../static/imgs/index/demo6.png',
    orderIcon: '../../static/imgs/center/icon1.png',
    historyIcon: '../../static/imgs/center/icon2.png',
    couponIcon: '../../static/imgs/center/icon3.png',
    arrowIcon: '../../static/imgs/center/icon-arrow.png',
    order: {},
    haveWaitPay: false,
    haveFinish: false,
    finishOrders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
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
    this.getorderList();
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

  handleCouponList() {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    })
  },

  handleOrderList() {
    wx.navigateTo({
      url: '/pages/orderlist/orderlist'
    })
  },

  handleNopayList() {
    wx.navigateTo({
      url: '/pages/notusedorder/notusedorder?type=nopay'
    })
  },

  handleWaitpayList() {
    wx.navigateTo({
      url: '/pages/notusedorder/notusedorder?type=waitpay'
    })
  },

  viewDetail(e) {
    var id = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/ordersuccess/ordersuccess?id=${id}`
    })
  },

  getorderList() {
    // 1.新订单 2.已确认 3.已完成
    // pay_status: 0 未支付 
    q({
      url: orderList,
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      let orders = res.data.data.orders;
      let { count, rows } = orders;
      if(count == 0) {
        this.setData({
          list: []
        })
      }else {
        rows.forEach(v => {
          if(v.order_status == 1 && v.pay_status == 0) {
            this.setData({
              haveWaitPay: true,
            })
          }
          if(v.order_status == 1 && v.pay_status == 1 && !Object.keys(this.data.order).length) {
            var order =  {
              date: this.formatDate(v.pay_time),
              image: v.image ? `${app.globalData.imageBase}${v.image.substring(1)}` : '',
              name: v.tourline_name,
              startDate: this.formatDate(v.start_time),
              orderNo: v.id,
              adult: v.adult_count,
              child: v.child_count,
            }
            this.setData({
              order: order,
              haveFinish: true,
            })
          }
        })
      }
    })
  },
  getVoucherList() {
    q({
      url: getVoucherList,
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      console.log(res, 'voucher');
      let { limited_voucher, unlimited_voucher } = res.data.data;
      this.setData({
        voucherCount: limited_voucher.length + unlimited_voucher.length,
      })
    })
  },

  formatDate(datee) {
    var ts = new Date(datee);
    var year = ts.getFullYear();
    var month = ts.getMonth() + 1;
    var date = ts.getDate();
    var day = ts.getDay();
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    if(month > 9) {
      return `${year}-${month}-${date} ${weekday[day]}`;
    }else {
      return `${year}-0${month}-${date} ${weekday[day]}`;
    }
  }

})