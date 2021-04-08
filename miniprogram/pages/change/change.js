const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navAndStaHeight:
    wx.getStorageSync('statusBarHeight') +
    wx.getStorageSync('navigationBarHeight') - 1 +
    'px',
    openid:'',
    invitation:'',
    user_admin:'',
    inviUser:[],

  },

    /**
   *更换涵码
   */
  updataUser(){
    const that =this
    wx.showLoading({
      title: '更换中',
    })
    wx.cloud.callFunction({
      name: 'updataUser',
      data: {
          user_id: that.data.openid,
          invi_detail: that.data.invitation,
          user_admin: that.data.user_admin,
      },
      success: res => {
        wx.setStorageSync('invitation', that.data.invitation)
        wx.setStorageSync('user_admin', that.data.user_admin)
        wx.reLaunch({
          url: '../user/history/history'
        })
      },
      fail: console.error  
    })        
  },

   /**
   *更换新涵码
   */
  clearUser(){
    const that =this
    wx.showLoading({
      title: '更换中',
    })
    wx.cloud.callFunction({
      name: 'updataUser',
      data: {
          user_id: that.data.openid,
          invi_detail: '',
          user_admin: '',
      },
      success: res => {
        wx.removeStorage({
          key: 'invitation',
        })
        wx.removeStorage({
          key: 'user_admin',
        })
        wx.reLaunch({
          url: '../bind/bind'
        })
        
      },
      fail: console.error  
    })        
  },

   /**
   *绑定新涵码
   */
  change(e){
    const idx = e.currentTarget.dataset.idx
    this.setData({
      invitation: this.data.inviUser[idx].invi_detail,
      user_admin: this.data.inviUser[idx].inviU_admin
    })
  },

     /**
   *获得历史涵码
   */
  getInvitation(){
    const that = this
    db.collection('inviUser').where({
      user_id: that.data.openid,
      inviU_delete: 0
    }).get().then(res => {
      that.setData({
        inviUser:res.data,
      })
    })
  },

    /**
   * 获得基本信息
   */
  getData(){
    this.setData({
      openid:wx.getStorageSync('openid'),
      invitation:wx.getStorageSync('invitation'),
      user_admin:wx.getStorageSync('user_admin'),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getInvitation()


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
})