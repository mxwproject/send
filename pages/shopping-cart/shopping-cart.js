// pages/shopping-cart/shopping-cart.js

const app = getApp()

import { q } from '../../config/q'
import { getShoppintCart, deleteCartItem } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // filterItem: ['国内中长线', '国内短线', '爆款尾单'],
    // selectedItem: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收藏',
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
    this.initShoppingCart();
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

  // 顶部筛选
  chooseFilter: function(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      selectedItem: index
    })
  },

  initShoppingCart() {
    q({
      url: getShoppintCart,
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      let result = res.data.data.tourline.rows;
      if(result.length) {
        let list = result.map(v => {
          return {
            id: v.id,
            name: v.name,
            saled: v.sale,
            price: v.price / 100,
            advance: v.advanceDay,
            banner: `${app.globalData.imageBase}${v.image.substring(1)}`,
          }
        })
        this.setData({
          list: list
        })
      }else {
        this.setData({
          list: []
        })
      }
    })
  },
  delete(e) {
    var id = e.detail.id;
    q({
      url: deleteCartItem(id),
      method: 'delete',
      header: {
        authorization: app.globalData.token,
      },
    }).then(res => {
      wx.showToast({
        title: '删除成功',
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
        success: (res) => {
        },
        fail: (res) => {
          
        },
        complete: (res) => {
          setTimeout(() => {
            this.initShoppingCart();
          }, 1500)
        }
      })
    })
  }
})