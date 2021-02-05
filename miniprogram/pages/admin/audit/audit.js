// miniprogram/pages/admin/audit/audit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 2 ,
    request:[{
      req_title:"标题sjbfhjdbvb点vjfjndfjvnjkcd11111",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'2'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'3'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'4'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'3'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'4'
    },{
      req_title:"标题",
      user_name:"xiaomingbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      req_time:'2020/20/11',
      req_state:'3'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'4'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'3'
    },{
      req_title:"标题",
      user_name:"xiaoming",
      req_time:'2020/20/11',
      req_state:'4'
    }]

  },

  /**
   * 导航栏
   */
  navbarTap:function(e){
    this.setData({ 
      currentTab: e.currentTarget.dataset.idx ,
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