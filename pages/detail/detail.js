// pages/detail/detail.js

//获取应用实例
const app = getApp()

const wxParser = require('../../components/wxParser/index');

import { q } from '../../config/q'
import { getTourlineDetail, getTourlineDetailItem, addToCart, makeOrder, deleteCartItem } from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    base: {},
    wechatIcon: '../../static/imgs/detail/contact.png',
    cartIcon: '../../static/imgs/detail/cart.png',
    cartIconSelect: '../../static/imgs/detail/cart-select.png',
    iconCurrent: '../../static/imgs/detail/cart.png',
    requestEnd: false,
    tourlineItem: [],
    clientHeight: 0,
    chooseLine: false,
    id: '',
    activeline: 0,
    selectlineId: '',
    adult_sale_price: 0,
    child_sale_price: 0,
    adultCount: 0,
    childCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id,
    })
    this.initData(id);
    this.getSystemInfo();
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
    // this.initData(this.data.id);
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

  // initData
  initData: function(id) {
    q({
      url: getTourlineDetail(id),
      header: {
        authorization: app.globalData.token,
      },
    }).then(res => {
      console.log(res, 'success');
      let detail = res.data && res.data.data;
      // let { }
      let { id, name, image, brief, sale, price,
            city_id, tourTotalDay,city_name,
            tourDesc, appointDesc, priceExplain, isCart } = detail.tourline;
      wx.setNavigationBarTitle({
        title: name,
      })
      this.setData({
        base: {
          id,
          name,
          image: `${app.globalData.imageBase}${image.substring(1)}`,
          brief,   // 推荐理由
          sale,
          price: price / 100,
          city_id,
          tourTotalDay,
          city_name,
          priceExplain,
        },
        iconCurrent: isCart ? this.data.cartIconSelect : this.data.cartIcon,
      })
      // 行程安排
      tourDesc = tourDesc.replace(/\.\/public\//g, `${app.globalData.imageBase}/public/`);
      appointDesc = appointDesc.replace(/\.\/public\//g, `${app.globalData.imageBase}/public/`);
      this.setData({
        requestEnd: true,
      })
      wxParser.parse({
        bind: 'xc',
        html: tourDesc,
        target: this,
        enablePreviewImage: false, // 禁用图片预览功能
      });
      wxParser.parse({
        bind: 'yd',
        html: appointDesc,
        target: this,
        enablePreviewImage: false, // 禁用图片预览功能
      });
    })
  },
  getTourlineDetailItem() {

  },
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        let brand = res.brand  // 手机品牌
        let model = res.model  // 手机型号
        let pixelRatio = res.pixelRatio  // 设备像素比
        let screenWidth = res.screenWidth  // 屏幕宽度
        let screenHeight = res.screenHeight  // 屏幕高度
        let windowWidth = res.windowWidth  // 可使用窗口宽度
        let windowHeight = res.windowHeight  // 可使用窗口高度
        let language = res.language  // 微信设置的语言
        let version = res.version  // 微信版本号
        let system = res.system  // 操作系统版本
        let platform = res.platform  // 客户端平台
        this.setData({
          clientHeight: windowHeight + 'px'
        })
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },
  handleOrder() {
    q({
      url: getTourlineDetailItem(this.data.id)
    }).then(res => {
      let result = res.data.data.tourlineItem;
      if(result.length) {
        let tourlineItem = [];
        tourlineItem = result.map(v => {
          let start_time = '';
          let vstart_time = v.start_time;
          let month = new Date(vstart_time).getMonth() + 1;
          let date = new Date(vstart_time).getDate();
          let day = new Date(vstart_time).getDay();
          var weekday=["周日","周一","周二","周三","周四","周五","周六"];
          if(month > 9) {
            start_time = `${month}-${date}（${weekday[day]}）`;
          }else {
            start_time = `0${month}-${date}（${weekday[day]}）`;
          }
          return Object.assign(v, {
            start_time: start_time,
          })
        })
        this.setData({
          tourlineItem: tourlineItem,
          selectlineId: tourlineItem[0].id,
          adult_sale_price: tourlineItem[0].adult_sale_price,
          child_sale_price: tourlineItem[0].child_sale_price,
        })
      }
      this.setData({
        chooseLine: true,
      })
    })
    
  },
  selectline(e) {
    var { id, index, adult_sale_price, child_sale_price} = e.currentTarget.dataset;
    this.setData({
      activeline: index,
      selectlineId: id,
      adult_sale_price: adult_sale_price,
      child_sale_price: child_sale_price,
    })
  },
  hidecWrap() {
    this.setData({
      chooseLine: false,
    })
  },
  dropAdult() {
    let adultCount = this.data.adultCount;
    if(!adultCount) {
      return;
    }
    this.setData({
      adultCount: adultCount - 1
    })
  },
  addAdult() {
    let adultCount = this.data.adultCount;
    this.setData({
      adultCount: adultCount + 1
    })
  },
  bindAdultInput(e) {
    this.setData({
      adultCount: e.detail.value
    })
  },
  dropChild() {
    let childCount = this.data.childCount;
    if(!childCount) {
      return;
    }
    this.setData({
      childCount: childCount - 1
    })
  },
  addChild() {
    let childCount = this.data.childCount;
    this.setData({
      childCount: childCount + 1
    })
  },
  bindChildInput(e) {
    this.setData({
      childCount: e.detail.value
    })
  },
  handleWrapSubmit() {
    q({
      url: makeOrder,
      method: 'post',
      header: {
        authorization: app.globalData.token,
      },
      data: {
        itemId: this.data.selectlineId,
        adultCount: this.data.adultCount,
        childCount: this.data.childCount,
      }
    }).then(res => {
      let {orderId} = res.data.data;
      var price = this.data.adultCount * this.data.adult_sale_price / 100 + this.data.childCount  * this.data.child_sale_price / 100; 
      this.hidecWrap();
      wx.navigateTo({
        url: `/pages/makeorder/makeorder?orderId=${orderId}&price=${price}`,
      })
    })
  },
  catchBubble() {
    return false;
  },
  addToCart() {
    
    if(this.data.iconCurrent == this.data.cartIconSelect) {
      this.delete();
      return;
    }

    q({
      url: addToCart(this.data.id),
      method: 'post',
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      this.setData({
        iconCurrent: this.data.cartIconSelect
      })
      wx.showToast({
        title: '收藏成功',
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
    })
  },
  delete(e) {
    var id = this.data.id;
    q({
      url: deleteCartItem(id),
      method: 'delete',
      header: {
        authorization: app.globalData.token,
      },
    }).then(res => {
      this.setData({
        iconCurrent: this.data.cartIcon
      })
      wx.showToast({
        title: '取消成功',
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
        success: (res) => {
        },
        fail: (res) => {
          
        },
        complete: (res) => {
          
        }
      })
    })
  }
})