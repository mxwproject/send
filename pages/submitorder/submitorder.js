// pages/submitorder/submitorder.js

const app = getApp()

import { q } from '../../config/q'
import { orderDetail, payOrder, getVoucherList } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contacter: {
      
    },
    travellers: [
      
    ],
    wechatIcon: '../../static/imgs/detail/contact.png',
    orderId: '',
    tourline_name: '',
    adult_count: '',
    child_count: '',
    orderId: '',
    couponId: '',
    isFromList: '',
    price: 0,
    start_time: '',
    order_memo: '',
    couponName: '',
    price: 0,
    couponId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var { price, orderId, from: isFromList, couponId } = options;

    this.setData({
      orderId,
      isFromList: isFromList || '',
      couponId: couponId || '',
      price: price || 0,
    })

    if(isFromList) {
    }else {
      this.initOrderInfo();
    }

    wx.setNavigationBarTitle({
      title: '确认订单',
      success: (res) => {
        
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
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
    this.getOrderDetail();
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

  initOrderInfo() {

    try {
      var contacter = JSON.parse(wx.getStorageSync('contacter'));
      var travellers = JSON.parse(wx.getStorageSync('travellers'));
    } catch (e) {
    }

    console.log(contacter, travellers, 'travellers');

    this.setData({
      contacter: contacter,
      travellers: travellers,
    })
  },

  getOrderDetail() {
    var personItem = this.data.personItem;
    var newPersons = [];
    q({
      url: orderDetail(this.data.orderId),
      header: {
        authorization: app.globalData.token,
      },
    }).then(res => {
      let { order } = res.data.data;
      let { adult_count, child_count, tourline_name, start_time, tour_total_day, 
            address, appoint_email, appoint_mobile, appoint_name, tourists, price, order_memo} = order;
      newPersons = new Array(adult_count + child_count).fill(personItem);
      this.setData({
        adult_count,
        child_count,
        tourline_name,
        tour_total_day,
        persons: newPersons,
        start_time: this.formateDate(start_time),
        order_memo: order_memo || '无',
      })
      if(this.data.isFromList) {
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
          email: appoint_email,
          address: address,
        }
        this.setData({
          contacter: contacter,
          travellers: travellers,
          price: price / 100,
        })
      }
    })
  },

  formateDate(time) {
    var string = time.split('T')[0];
    var day = new Date(time).getDay();
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    string += ` ${weekday[day]}`;
    return string;
  },

  handleOrder() {
    q({
      url: payOrder,
      method: 'post',
      header: {
        authorization: app.globalData.token,
      },
      data: {
        orderId: this.data.orderId,
        voucherId: this.data.couponId,
      }
    }).then(res => {
      this.handlePay(res.data.data);
    })
  },

  handlePay(res) {
    let {timeStamp, nonceStr, paySign} = res;
    let packageCode = res.package;
    let orderId = this.data.orderId;
    wx.requestPayment({
     timeStamp,
     nonceStr,
     package: packageCode,
     signType: 'MD5',
     paySign,
     success: (res) => {
        wx.navigateTo({
          url: `/pages/paysuccess/paysuccess?id=${orderId}`,
        })
     },
     fail: (res) => {
        wx.navigateTo({
          url: `/pages/payfailed/payfailed?orderId=${orderId}`,
        })
     }
  })
  }
})