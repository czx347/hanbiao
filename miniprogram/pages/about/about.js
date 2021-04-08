// miniprogram/pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version:'1.0.0',
    envVersion:''

  },

  /**
   * 获得版本号
   */
  getVersion(){
    const accountInfo = wx.getAccountInfoSync();
    let envVersion = accountInfo.miniProgram.envVersion;
    if(envVersion === 'develop'){
      envVersion = '开发版'
    }else if(envVersion === 'trial'){
      envVersion = '体验版'
    }else if(envVersion === 'release'){
      envVersion = '正式版'
    }
    this.setData({
      version:accountInfo.miniProgram.version,
      envVersion:envVersion ,
    })
  },

  /**
   * 更新
   */
  updataMiniProgram(){
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          console.log('onCheckForUpdate====', res)
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  console.log('success====', res)
                  // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              })
            })
          }else{
            wx.showToast({
              title: '当前版本已最新',
              duration: 2000
            })
          }
        })
      }
      // this.UserLogin();    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVersion()

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