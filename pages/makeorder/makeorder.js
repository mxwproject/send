// pages/makeorder/makeorder.js

const app = getApp()

import { q } from '../../config/q'
import { orderDetail, getVoucherList, addContacter, addTraveller, makeOrder, deleteTraveller, getHomeInfo, getVoucher} from '../../config/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatIcon: '../../static/imgs/detail/contact.png',
    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
    persons: [
      
    ],
    personItem: {
      name: '',
      idcard: '',
      phone: '',
      index2: 0,
    },
    nameIcon: '../../static/imgs/makeorder/name.png',
    phoneIcon: '../../static/imgs/makeorder/phone.png',
    emailIcon: '../../static/imgs/makeorder/name.png',
    addressIcon: '../../static/imgs/makeorder/location.png',
    idcardIcon: '../../static/imgs/makeorder/idcard.png',
    couponIcon: '../../static/imgs/makeorder/coupon.png',
    arrowIcon: '../../static/imgs/center/icon-arrow.png',
    orderId: '',
    price: 0,
    basePrice: 0,
    start_time: '',
    couponId: '',
    couponIdMoney: '',
    meno: '',
    couponName: '暂无优惠券',
    tourline_name: '',
    adult_count: '',
    child_count: '',
    idTypeArray: ['身份证', '护照', '军官证', '港澳通行证', '台胞证', '其他' ],
    cangetcoupon: false,
    showFlag: false,
    animationData: {},
    voucher: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options');
    wx.setNavigationBarTitle({
      title: '提交订单',
      success: (res) => {
        
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
    var { orderId, price, couponId, money } = options;
    this.setData({
      orderId: orderId,
      price: price,
      basePrice: price,
    })
    if(!couponId) {
      this.getVoucherList();
    }else {
      this.setData({
        couponId: couponId,
        couponIdMoney: money,
        couponName: `-${money}`,
        price: this.data.basePrice - parseInt(money),
      })
    }
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
    // var contacter = wx.getStorageSync('contacter');
    // var travellers = wx.getStorageSync('travellers');
    // var contacter = JSON.parse(contacter);
    // var travellers = JSON.parse(travellers);
    // this.setData({
    //   contact: contacter,
    //   persons: travellers,
    // })
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

  handleCnameInput(e) {
    this.setData({
      'contact.name': e.detail.value
    })
  },
  handleCphoneInput(e) {
    this.setData({
      'contact.phone': e.detail.value
    })
  },
  handleCemailInput(e) {
    this.setData({
      'contact.email': e.detail.value
    })
  },
  handleCaddressInput(e) {
    this.setData({
      'contact.address': e.detail.value
    })
  },
  handlePnameInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var persons = this.data.persons;
    persons[index].name = value;
    this.setData({
      persons: persons
    })
  },
  handlePidcardInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var persons = this.data.persons;
    persons[index].idcard = value;
    this.setData({
      persons: persons
    })
  },
  handlePphoneInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var persons = this.data.persons;
    persons[index].phone = value;
    this.setData({
      persons: persons
    })
  },

  handleRemarkInput(e) {
    this.setData({
      'meno': e.detail.value
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
      let { adult_count, child_count, tourline_name, start_time, tour_total_day, appoint_name, appoint_mobile, appoint_email, address, tourists } = order;
      for(var i = 0; i < adult_count + child_count; i ++) {
        var obj = this.deepClone(personItem);
        newPersons.push(obj);
      }
      this.setData({
        adult_count,
        child_count,
        tourline_name,
        tour_total_day,
        start_time: this.formateDate(start_time),
        persons: newPersons,
      })
      if(appoint_name) {
        var contacter = {
          name: appoint_name,
          phone: appoint_mobile,
          email: appoint_email,
          address: address,
        }
        var travellers = tourists.map(v => {
          return {
            name: v.name,
            phone: v.mobile,
            idcard: v.paper_sn,
            index2: v.paper_type,
          }
        });
        this.setData({
          contact: contacter,
          persons: travellers,
        })
        this.deleteTraveller();
      }
    })
  },
  handleOrder() {
    // 联系人验证
    let {name, phone, email, address} = this.data.contact;
    var contactError = '';
    var travelError = '';
    let phoneReg = /^1[34578]\d{9}$/;
    let emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let idcardReg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
    if(name == '') {
      contactError = '请输入真实联系人姓名';
    }else if(phone == '' || !phoneReg.test(phone)) {
      contactError = '请输入正确的联系人手机号';
    }else if(email == '' || !emailReg.test(email)) {
      contactError = '请输入正确的联系人邮箱';
    }else if(address == '') {
      contactError = '请输入具体的收货地址';
    }
    if(contactError) {
      wx.showToast({
        title: contactError,
        icon: 'none', // "success", "loading", "none"
        duration: 1500,
        mask: false,
      })
      return;
    }
    try {
      this.data.persons.forEach((v, index) => {
        if(v.name == '') {
          throw `请填写第${index + 1}位旅客的姓名`;
          // throw 'haha'
        }
        if(v.idcard == '') {
          throw `请正确填写第${index + 1}位旅客的证件号`;
        }
        if(v.index2 == 1 && !idcardReg.test(v.idcard)) {
          throw `请正确填写第${index + 1}位旅客的身份证号`;
        }
        if(v.phone == '' || !phoneReg.test(v.phone)) {
          throw `请正确填写第${index + 1}位旅客的手机号`;
        }
      })
    }catch(e) {
      if(e) {
        wx.showToast({
          title: e,
          icon: 'none', // "success", "loading", "none"
          duration: 1000,
          mask: false,
        })
        return;
      }
    }
    this.handleaddContacter();
  },

  // 添加联系人
  handleaddContacter() {
    var { contact } = this.data;
    var { name, phone: mobile, email, address} = contact;
    q({
      url: addContacter,
      method: 'post',
      header: {
        authorization: app.globalData.token,
      },
      data: {
        orderId: this.data.orderId,
        name, 
        mobile, 
        email, 
        address, 
        memo: this.data.meno || '',
      }
    }).then(res => {
      this.handleaddTraveller();
    })
  },
  // 添加出行人
  handleaddTraveller() {
    var travellers = this.data.persons.map(v => {
      return {
        name: v.name, 
        sn: v.idcard,
        mobile: v.phone,
        type: v.index2,
      }
    })
    q({
      url: addTraveller,
      method: 'post',
      header: {
        authorization: app.globalData.token,
      },
      data: {
        orderId: this.data.orderId,
        list: travellers,
      }
    }).then(res => {
       this.handleOrderSubmit();
    })
  },

  handleOrderSubmit() {
    var { orderId, price, couponId} = this.data;

    var contacter = JSON.stringify(this.data.contact);
    var travellers = JSON.stringify(this.data.persons);
    try {
        wx.setStorageSync('contacter', contacter);
        wx.setStorageSync('travellers', travellers);
    } catch (e) {    
    }

    // q({
    //   url: makeOrder,
    //   method: 'post',
    //   header: {
    //     authorization: app.globalData.token,
    //   },
    //   data: {
    //     itemId: this.data.selectlineId,
    //     adultCount: this.data.adultCount,
    //     childCount: this.data.childCount,
    //   }
    // }).then(res => {
    //   let {orderId} = res.data.data;
    //   var price = this.data.adultCount * this.data.adult_sale_price / 100 + this.data.childCount  * this.data.child_sale_price / 100; 
    //   this.hidecWrap();
    //   wx.navigateTo({
    //     url: `/pages/makeorder/makeorder?orderId=${orderId}&price=${price}`,
    //   })
    // })


    wx.navigateTo({
      url: `/pages/submitorder/submitorder?orderId=${orderId}&couponId=${couponId}&price=${price}`,
    })
  },

  bindPickerChange(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var persons = this.data.persons;
    console.log(e, 'picker发送选择改变，携带值为', e.detail.value, index)
    persons[index].index2 = parseInt(value);
    console.log(persons);
    this.setData({
      persons
    })
  },

  chooseCoupon() {
    wx.navigateTo({
      url: `/pages/coupon/coupon?orderId=${this.data.orderId}&price=${this.data.basePrice}`,
    })
  },

  getVoucherList() {
    q({
      url: getVoucherList,
      header: {
        authorization: app.globalData.token,
      }
    }).then(res => {
      let { limited_voucher, unlimited_voucher } = res.data.data;
      if(!limited_voucher.length && !unlimited_voucher.length) {
        this.setData({
          couponName: '暂无优惠券',
        })
        this.getHomeInfo();
      }else if(limited_voucher.length){
        this.setData({
          couponName: `-${limited_voucher[0].money / 100}`,
          price: this.data.basePrice - limited_voucher[0].money / 100,
          couponId: limited_voucher[0].id,
          cangetcoupon: false,
        })
      }else if(unlimited_voucher.length) {
        this.setData({
          couponName: `-${unlimited_voucher[0].money / 100}`,
          price: this.data.basePrice - unlimited_voucher[0].money / 100,
          couponId: unlimited_voucher[0].id,
          cangetcoupon: false,
        })
      }
    })
  },

  getHomeInfo() {
    q({
      url: getHomeInfo,
    }).then(res => {
      console.log('couponse', res);
      var { voucher } = res.data.data;
      if(Object.keys(voucher).length) {
        this.setData({
          cangetcoupon: true,
          voucher: Object.assign(voucher, {
            status: 1,
          })
        })
      }
    })
  },

  getCoupon(e) {
    let { id } = e.currentTarget.dataset;
    if(this.data.voucher.status == 2) {
      return;
    }
    q({
      url: getVoucher,
      method: 'post',
      header: {
        authorization: app.globalData.token,
      },
      data: {
        id
      }
    }).then(res => {
      wx.showToast({
        title: '领取成功',
        icon: 'success', // "success", "loading", "none"
        duration: 1500,
        mask: false,
        success: (res) => {
          this.setData({
            'voucher.status': 2,
          })
          this.getVoucherList();
        },
        fail: (res) => {
          
        },
        complete: (res) => {
          
        }
      })
    })
  },

  deleteTraveller() {
    q({
      url: deleteTraveller,
      method: 'delete',
      data: {
        orderId: this.data.orderId,
      }
    }).then(res => {
      console.log('delete successfully');
    })
  },

  formateDate(time) {
    var string = time.split('T')[0];
    var day = new Date(time).getDay();
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    string += ` ${weekday[day]}`;
    return string;
  },

  deepClone (obj) {
    var _tmp,result;
    _tmp = JSON.stringify(obj);
    result = JSON.parse(_tmp);
    return result;
  } ,

  showModal () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showFlag: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showFlag: false
      })
    }, 200)
  }

})