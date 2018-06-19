// pages/ordersuccess/ordersuccess.js

const app = getApp()

import { q } from '../../config/q'
import { orderDetail } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      // oNumber: '174894040',  // 订单编号 
      // time: '2018-05-18', // 预定时间 
      // tourline: '溧阳南山、天目湖、假日花园大酒店（豪华房）2晚3日',   // 行程名字
      // startTime: '05/28',  // 出发时间 
      // endTime: '06/01', // 返程时间 
      // adultCount: '2',  // 大人个数
      // childCount: '1', // 儿童个数
      // totalMoney: 1990, // 实付金额 
      // tNumber: '3338888' // 线路编号
    },
    contacter: {
      
    },
    travellers: [
      
    ],
    contactIcon: '../../static/imgs/ordersuccess/contact.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    console.log(id, 'options.id');
    this.getOrderDetail(id);
    wx.setNavigationBarTitle({
      title: '订单详情',
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
  
  },

  getOrderDetail(id) {
    q({
      url: orderDetail(id),
      header: {
        authorization: app.globalData.token,
      },
    }).then(res => {
      let { order } = res.data.data;
      let { adult_count, child_count, tourline_name, start_time, tour_total_day, 
            address, appoint_email, appoint_mobile, appoint_name, tourists, price, sn, pay_time, order_memo, priceExplain} = order;
      var travellers = tourists.map(v => {
        return {
          name: v.name,
          phone: v.mobile,
          idcard: v.paper_sn,
        }
      });
      var contacter = {
        name: appoint_name,
        phone: appoint_mobile,
        email: appoint_email || '',
        address: address || '',
      }
      var orderInfo = {
        oNumber: sn, 
        time: this.formatPaytime(pay_time * 1000),
        tourline: tourline_name,
        startTime: this.formatStartTime(start_time),
        endTime: this.formatEndTime(start_time),
        adultCount: adult_count,
        childCount: child_count,
        tNumber: '',
        totalMoney: price / 100,
        order_memo: order_memo || '无',
        priceExplain: priceExplain || '',
      }
      this.setData({
        order: orderInfo,
        contacter: contacter,
        travellers: travellers,
        price: price / 100,
      })
    })
  },
  formatPaytime(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date = date.getDate();
    return year + '-' + (month > 9 ? month : `0${month}`) + '-' + (date > 9 ? date : `0${date}`);
  },
  formatStartTime(time) {
    var date = new Date(time);
    var month = date.getMonth() + 1;
    var date = date.getDate();
    return (month > 9 ? month : `0${month}`) + '-' + (date > 9 ? date : `0${date}`);
  },
  formatEndTime(time) {
    var date = new Date(new Date(time).getTime() + 5 * 24 * 3600 * 1000);
    var month = date.getMonth() + 1;
    var date = date.getDate();
    return (month > 9 ? month : `0${month}`) + '-' + (date > 9 ? date : `0${date}`);
  },

  backtoindex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})