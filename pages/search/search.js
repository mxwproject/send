// pages/search/search.js

//获取应用实例
const app = getApp()
import { q } from '../../config/q'
import { searchByKeyword } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchIcon: '../../static/imgs/index/search.png',
    deleteIcon: '../../static/imgs/search/delete.png',
    keyword: '',
    searchResult: [],
    showList: false,
    history: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '搜索',
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
    this.getHistory();
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

  getHistory() {
    var his = wx.getStorageSync('history');
    if(!his) {
      this.setData({
        history: [],
      })
    }else {
      this.setData({
        history: JSON.parse(his),
      })
    }
  },

  bindKeyInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  chooseHistory(e) {
    this.setData({
      keyword: e.currentTarget.dataset.item,
      showList: true,
    })
    this.handleSearch();
  },

  handleSearch() {
    if(this.data.keyword == '') {
      wx.showToast({
        title: '请输入目的地、景点',
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
      return;
    }
    q({
      url: searchByKeyword(this.data.keyword),
    }).then(res => {
      let result = res.data.data;
      if(result.length) {
        let searchResult = result.map(v => {
          return {
            id: v.id,
            name: v.name,
            banner: `${app.globalData.imageBase}${v.image.substring(1)}`,
            intro: v.brief,
            saled: v.sale,
            price: v.price / 100,
          }
        })
        var his = this.data.history;
        if(!his.includes(this.data.keyword)) {
          his.push(this.data.keyword);
        }
        this.setData({
          searchResult: searchResult,
          history: his,
        })
        try {
            wx.setStorageSync('history', JSON.stringify(his));
        } catch (e) {
            
        }
      }else {
        this.setData({
          searchResult: []
        })
      }
      this.setData({
        showList: true
      })
    })
  },

  deleteHistory() {
    wx.showModal({
      title: '确定删除所有历史搜索吗',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#70AAF4',
      success: (res) => {
        // res.confirm 为 true 时，表示用户点击了确定按钮
        if(res.confirm) {
          this.setHistoryNull();
        }
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },


  setHistoryNull() {
    try {
        wx.setStorageSync('history', JSON.stringify([]));
    } catch (e) {
        
    }
    this.getHistory();
  },
})