const db = wx.cloud.database();
let xBefore
let xAfetr
let yBefore
let yAfetr
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 获得基本信息
   */
  getData(){
    this.setData({
      openid:wx.getStorageSync('openid'),
      invitation:wx.getStorageSync('invitation'),
      user_admin:wx.getStorageSync('user_admin'),
      user:{
        user_name:'用户名',
        user_photo:''
      },
      anno_name:''
    })
  },

    /**
   * 触摸前
   */
  touchStart(e) {
    xBefore = e.changedTouches[0].clientX
    yBefore = e.changedTouches[0].clientY
  },

  /**
   * 触摸中
   */
  touchMove(e){
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    if(xBefore - x < -50 && Math.abs(yBefore - y) < 100 ){
      wx.showToast({
        title: '<<<',
        icon:'none',
        duration: 300
      })
    }else if(xBefore - x > 50 && Math.abs(yBefore - y) < 100){
      wx.showToast({
        title: '>>>',
        icon:'none',
        duration: 300
      })
    }

  },

  /**
   * 触摸后
   */
  touchEnd(e) {
    xAfetr = e.changedTouches[0].clientX;
    yAfetr = e.changedTouches[0].clientY;
    if(xBefore - xAfetr > 50 && Math.abs(yBefore - yAfetr) < 100){
      wx.switchTab({
        url: '../user/history/history',
      })
    }else if (xBefore - xAfetr < -50 && Math.abs(yBefore - yAfetr) < 100){
      wx.switchTab({
        url: '../admin/userManagement/userManagement',
      })
    }
  },

   /**
   * 退出当前涵码
   */
  deleteUser(){
    const that = this
    wx.showModal({
      title: '提示',
      content: '是否确定退出当前涵码',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '退出中',
          })
          wx.cloud.callFunction({
            name: 'deleteUser',
            data: {
              user:{
                id:that.data.openid,
                invi_detail:''
              },
              inviUser:{
                invi_detail:that.data.invitation,
                user_id:that.data.openid,
                inviU_delete:1
              },
            },
            success: res => {
              wx.hideLoading()
              wx.reLaunch({
                url: '../bind/bind'
              })
            },
            fail: error =>{
              wx.hideLoading()
              wx.showToast({
                title: '退出失败',
                icon: 'error',
                duration: 2000
              }) 
              console.error  
            }
          })
        }
      }
    })    
  },

    /**
   * 获得通知
   */
  getAnnouncement(){
    const that = this
    db.collection('announcement').where({
      invi_detail: that.data.invitation,
      anno_live:1,
      anno_delete: 0
    }).get().then(res => {
      if(res.data != '')
      {
        that.setData({
          anno_name:res.data[0].anno_name,
        })
      }else{
        that.setData({
          anno_name:'',
        })
      }
    })
  },

  /**
   * 跳转界面
   */
  navigateTo: function (e) {
    wx.redirectTo({
      url: e.currentTarget.dataset.idx
    })
  },

  /**
   * 展示通知
   */
  showInform(){
    const anno_name = this.data.anno_name || '无通知'
    wx.showModal({
      title: '通知',
      content: anno_name,
    })
  },

  /**
   * 获得用户信息
   */
  getUser() {
    const that = this
    db.collection('user').doc(that.data.openid).get().then(res => {
      that.setData({
        user:res.data
      })
    })
  },

    /**
   * 检查是否更新
   */
  checkInform(){
    const that = this
    wx.getStorage({
      key: 'updataInform',
      success (res) {
        that.getAnnouncement()
        wx.removeStorage({
          key: 'updataInform',
        })
      }
    })
    wx.getStorage({
      key: 'updataName',
      success (res) {
        that.getUser()
        wx.removeStorage({
          key: 'updataName',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getUser()
    this.getAnnouncement()


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
    if(this.data.invitation == ''){
      wx.reLaunch({
        url: '../../bind/bind',
      })
    }
    this.checkInform()

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
   * 转发
   */
  onShareAppMessage: async function (res) {
    wx.showToast({
      title: '分享中',
      icon: 'loading',
      duration: 2000
    })
    return {
      title: '邀请你加入涵码:'+ this.data.invitation,
      path: '/pages/bind/bind?invitation=' + this.data.invitation,
      success: function (res) {
        console.log('成功', res)
      },
      fail(e){
        console.log(e)
      }
    }
  }
})