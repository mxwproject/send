// pages/notusedorder/notusedorder.js

const app = getApp()

import { q } from '../../config/q'
import { orderList, deleteOrder } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
    ],
    nopaylist: [
      
    ],
    count: false,
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    if(type == 'nopay') {
      wx.setNavigationBarTitle({
        title: '待付款订单',
      })
    }else {
      wx.setNavigationBarTitle({
        title: '未出行订单',
      })
    }
    this.setData({
      type: type,
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
          count: false
        })
      }else {
        var nopaylist = [];
        var list = [];
        rows.forEach(v => {
          if(v.order_status == 1 && v.pay_status == 0) {
            nopaylist.push({
              date: this.formatDate(v.pay_time * 1000),
              image: v.image ? `${app.globalData.imageBase}${v.image.substring(1)}` : '',
              name: v.tourline_name,
              startDate: this.formatDate(v.start_time),
              tour_total_day: v.tour_total_day || 0,
              price: v.total_price !== 0 ? v.total_price / 100 : '',
              orderNo: v.id,
            }) 
          }
          if(v.order_status == 1 && v.pay_status == 1) {
            list.push({
              date: this.formatDate(v.pay_time * 1000),
              image: v.image ? `${app.globalData.imageBase}${v.image.substring(1)}` : '',
              name: v.tourline_name,
              startDate: this.formatDate(v.start_time),
              tour_total_day: v.tour_total_day || 0,
              price: v.total_price !== 0 ? v.total_price / 100 : '',
              orderNo: v.id,
              adult: v.adult_count,
              child: v.child_count,
              tourline_id: v.tourline_id,
            }) 
          }
        })
        this.setData({
          nopaylist: nopaylist,
          list: list,
          count: true,
        })
      }
    })
  },

  viewDetail(e) {
    var id = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/ordersuccess/ordersuccess?id=${id}`
    })
  },

  formatDate(datee) {
    var ts = new Date(datee);
    var month = ts.getMonth() + 1;
    var date = ts.getDate();
    if(month > 9) {
      if(date > 9) {
        return `${month}-${date}`;
      }
      return `${month}-0${date}`;
    }else {
      if(date > 9) {
        return `0${month}-${date}`;
      }
      return `0${month}-0${date}`;
    }
  },

  deleteOrder(e) {
    var id = e.currentTarget.dataset.orderno;
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗',
      confirmColor: '#70AAF4',
      success: (res) => {
        if (res.confirm) {
          this.confirmDelete(id);
        } else if (res.cancel) {
        }
      }
    })
  },

  confirmDelete(id) {
    q({
      url: deleteOrder(id),
      method: 'delete',
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      wx.showToast({
        title: '取消成功',
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
      })
      setTimeout(() => {
        this.getorderList();
      }, 1500)
    })
  },

  handleContinue(e) {
    var id = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/submitorder/submitorder?orderId=${id}&from=list`
    })
  },

  handleDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }
})