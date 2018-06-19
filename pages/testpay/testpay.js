// pages/testpay/testpay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip: 'failed'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://www.baidu.com'
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

  testpay() {
    wx.requestPayment({
      timeStamp: '1527052604',
      nonceStr: 'ewQ4tYQ8dcCKEjZu',
      package: 'prepay_id=wx23131645575990969e18f2b80595053549',
      signType: 'MD5',
      paySign: '64F4E9F0EE38E4446CAFADEF57728D93',
      success: (res) => {
        this.setData({
          tip: 'success'
        })
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  }
})