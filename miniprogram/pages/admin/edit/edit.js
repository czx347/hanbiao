Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏和状态栏高度
    navAndStaHeight:
    wx.getStorageSync('statusBarHeight') +
    wx.getStorageSync('navigationBarHeight'),
    currentTab: true ,
    formStyle:[{
      formS_type: 0,
      show:true,
    }]

  },

  /**
   * 导航栏
   */
  navbarTap:function(){
    this.setData({
      currentTab: !this.data.currentTab
    })
  },

  /**
   *增加数据类型
   */
  addFormStyle:function(e){
    const type = e.currentTarget.dataset.idx
    if(type === '5' ||type === '6')
    {
      this.data.formStyle.push({
        formS_type: type * 1,
        show:true,
        formS_detail:['']
      })
    }else{
      this.data.formStyle.push({
        formS_type: type * 1,
        show:true,
      })
    }

    this.setData({
      formStyle: this.data.formStyle
    })
  },

  /**
   *删除数据类型
   */
  deleteFormStyle:function(e){
    const number = e.currentTarget.dataset.idx
    this.data.formStyle.splice(number * 1,1)
    this.setData({
      formStyle: this.data.formStyle
    })

  },

   /**
   *删除选项
   */
  deleteOption:function(e){
    const idx = e.currentTarget.dataset.idx
    const number = idx.split('+')
    this.data.formStyle[number[0]].formS_detail.splice(number[1] * 1,1)
    this.setData({
      formStyle: this.data.formStyle
    })

  },

  /**
   *增加选项
   */
  addOption:function(e){
    const number = e.currentTarget.dataset.idx
    this.data.formStyle[number].formS_detail.push('')
    this.setData({
      formStyle: this.data.formStyle
    })
  },

   /**
   *展开
   */
  show:function(e){
    const show = 'formStyle[' + e.currentTarget.dataset.idx + '].show'
    this.setData({
      [show]:e.detail.value
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