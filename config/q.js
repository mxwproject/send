// 接口 Promise 化
const q = (option = {}) => {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: option.url || '',
      method: option.method || 'get',
      data: option.data || {},
      header: option.header || {},
      success: function(data) {
        wx.hideLoading()
        if(data.data.code == -1) {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 1500,
          })
        }else {
          resolve(data)
        }
      },
      fail: function(err) {
        // reject(err)
        wx.hideLoading();
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 1500,
          mask: false,
        })
      }
    })
  })
}

module.exports = {
  q: q
}