// pages/contact/contact.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    wechatIcon: '../../static/imgs/contact/wechat.png',
    phoneIcon: '../../static/imgs/contact/phone.png',
    phoneNumbers: [{
      name: '线路咨询',
      number: '021-34141583'
    },{
      name: '售卡咨询',
      number: '021-64753853'
    }],
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '客服',
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
    this.setData({
      showModal: false,
    })
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

  calling: function(e) {
    var number = e.currentTarget.dataset.number;
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: number,
      success: function() {
        _this.closeModal();
      }
    })
  },
  openModal() {
    this.setData({
      showModal: true,
    })
  },
  closeModal() {
    this.setData({
      showModal: false,
    })
  }
})