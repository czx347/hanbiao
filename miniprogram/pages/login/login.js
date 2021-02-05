const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 授权登录
   */
  login:function(){
    wx.cloud.callFunction({
      name: 'login',
      success: function(res) {
        const openid = res.result.openid
        db.collection('user').where({
          _openid: openid
        }).get().then(res => {
          //确保数据库只有一份该用户的信息
          if (res.data == "") {
            console.log("授权登录成功")
            db.collection('user').add({
              data: {
                user_time: Date()
              }
            })
          // 跳转到主界面
          wx.navigateTo({
            url: '../home/home',//登录成功后要跳转的页面
          })
          } else {
            console.log("已经登录过不用授权")
            // wx.redirectTo({
            //   url: '../home/home'
            // })
            wx.navigateTo({
              url: '../home/home',//登录成功后要跳转的页面
            })
          
          }
        })
      },
      fail: console.error  
    })
  },

  test:function(){
    wx.navigateTo({
      url: '../home/home',//登录成功后要跳转的页面
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})