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
    // this.getorderList();
    // this.getVoucherList();
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


  handleNopayList() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none', // "success", "loading", "none"
      duration: 1000,
      mask: false,
      success: (res) => {
        
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },

  handleWaitpayList() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none', // "success", "loading", "none"
      duration: 1000,
      mask: false,
      success: (res) => {
        
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },







})