// put api list here
const baseUrl = 'https://lyh.uu-club.com/api'

// 所有接口列表如下：
const getHomeInfo = `${baseUrl}/home`;

const tourlineTypeList = `${baseUrl}/tourline`;

const getTourlineDetail = id => `${baseUrl}/tourline/${id}`;

const getTourlineDetailItem = id => `${baseUrl}/tourline/item/${id}`;

const searchByKeyword = q => `${baseUrl}/tourline/search?q=${q}`;

const getShoppintCart = `${baseUrl}/tourline/cart`;

const getTourlines = (range, pageSize, pageNo, order, sort) => {
	if(order) {
		return `${baseUrl}/tourline?range=${range}&pageSize=${pageSize}&pageNo=${pageNo}&order=${order}&sort=${sort}`;
	}
	return `${baseUrl}/tourline?range=${range}&pageSize=${pageSize}&pageNo=${pageNo}`;
}
const getVoucher = `${baseUrl}/voucher/3`;   // 领取优惠券

const getVoucherList = `${baseUrl}/voucher`;  // 优惠券列表

const addToCart = id => `${baseUrl}/tourline/cart/${id}`;

const deleteCartItem = id => `${baseUrl}/tourline/cart/${id}`;

// 订单相关
const payOrder = `${baseUrl}/order/tourline/pay`;  // 支付 

const deleteOrder = id => `${baseUrl}/order/tourline/${id}`;   // 删除订单

const addTraveller = `${baseUrl}/order/tourline/tourist`;   // 添加出行人

const deleteTraveller = `${baseUrl}/order/tourline/tourist`; // 删除出行人

const addContacter = `${baseUrl}/order/tourline/linkman`;   // 添加联系人

const orderDetail = id => `${baseUrl}/order/tourline/${id}`;   // 订单详情

const orderList = `${baseUrl}/order/tourline`;   // 订单列表 get

const makeOrder = `${baseUrl}/order/tourline`;  // 下订单 post

// 登录想着

const wechatLogin = `${baseUrl}/wechat/login`;  // 微信登录

const getSendCode = `${baseUrl}/user/sendCode`;   // 发送验证码

const bindMobile = `${baseUrl}/user/bindMobile`;   // 绑定手机号

module.exports = {
  getHomeInfo: getHomeInfo,
  getTourlineDetail: getTourlineDetail,
  getTourlineDetailItem: getTourlineDetailItem,
  searchByKeyword: searchByKeyword,
  getShoppintCart: getShoppintCart,
  getTourlines: getTourlines,
  getVoucher: getVoucher,
  getVoucherList: getVoucherList,
  payOrder: payOrder,
  addToCart: addToCart,
  deleteOrder: deleteOrder,
  addTraveller: addTraveller,
  addContacter: addContacter,
  orderDetail: orderDetail,
  orderList: orderList,
  makeOrder: makeOrder,
  wechatLogin: wechatLogin,
  getSendCode: getSendCode,
  bindMobile: bindMobile,
  deleteCartItem: deleteCartItem,
  deleteTraveller: deleteTraveller,
  tourlineTypeList: tourlineTypeList,
}