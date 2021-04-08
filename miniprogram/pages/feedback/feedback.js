const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback:''

  },

  /**
   * 绑定数据
   */
  bindFeedback(e){
    this.setData({
      feedback:e.detail.value
    })
  },

  /**
   * 提交
   */
  save(){
    const that = this
    db.collection('feedback').add({
      data: {
        detail:that.data.feedback   
      },
      success:()=>{
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        }) 
      },
      fail:()=>{
        wx.showToast({
          title: '提交成功',
          icon: 'error',
          duration: 2000
        }) 
      },
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
})