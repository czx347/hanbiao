const db = wx.cloud.database();
const _ = db.command
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
      invitation:wx.getStorageSync('invitation'),
      user:'',
      text:'加载中...',
      request:[],
      user_id:'',
      inviU_admin:'',
    })
    
  },

  /**
   * 转换时间
   */
  format(Date){
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
      M = M < 10 ? '0' + M : M;// 不够两位补充0
    var D = Date.getDate();
      D = D < 10 ? '0' + D : D;
    var H = Date.getHours();
      H = H < 10 ? '0' + H : H;
    var Mi = Date.getMinutes();
      Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = Date.getSeconds();
      S = S < 10 ? '0' + S : S;
      return Y + '/' + M + '/' + D + ' ' + H + ':' + Mi + ':' + S;
  },

  /**
   * 获得请求
   */
  getRequest(){
    const that = this
    const user_id = this.data.user_id
    const inviU_admin = this.data.inviU_admin
    const user = this.data.user
    if(inviU_admin == 0){ 
      db.collection('request').where({
        req_state:_.gte(2),
        invi_detail: that.data.invitation,
        user_id:user_id,
        req_delete: 0
      }).orderBy('req_state','asc').orderBy('req_time','desc').get().then(res => {
          let list = res.data
          for (const l of list) {
            l.req_time= that.format(new Date(l.req_time));
          }
        that.setData({
          user:user + '提交',
          request:list,
          text:'--- 无数据啦 ---',
        })
      }).catch(e =>{
        console.log(e)
      })
    }else{    
      db.collection('request').where({
        req_state:_.gte(2),
        invi_detail: that.data.invitation,
        req_check:user_id,
        req_delete: 0
      }).orderBy('req_state','asc').orderBy('req_time','desc').get().then(res => {
          let list = res.data
          for (const l of list) {
            l.req_time= that.format(new Date(l.req_time));
          }
        that.setData({
          user:user + '审核',
          request:list,
          text:'--- 无数据啦 ---',
        })
      }).catch(e =>{
        console.log(e)
      })
    }
  },

  /**
   * 跳转详细
   */
  requestDetail(e){
    const number = e.currentTarget.dataset.idx
    const req_id = this.data.request[number]._id
    wx.navigateTo({
      url: '../user/add/add?req_id=' + req_id,
    })
  },

  /**
   * 意见
   */
  option(e){
    const number = e.currentTarget.dataset.idx * 1
    const that = this
    wx.showModal({
      title: '意见',
      content: that.data.request[number].req_reply,
    })    
  },

  /**
   * 管理员撤回
   */
  adminRecall(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    let request = this.data.request
    wx.showModal({
      title: '提示',
      content: '是否撤回' + request[number].req_title + '?',
      success (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updataRequestState',
            data:{
              req_id:request[number]._id,
              req_state:2,
              req_time:Date(),
            },
            success: function(res) {
              const req_state = 'request['+number+'].req_state'
              that.setData({
                [req_state]:2
              })
              wx.showToast({
                title: '撤回成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(){
              wx.showToast({
                title: '撤回失败',
                icon: 'error',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.setData({
    user : options.user_name,
    user_id : options.user_id,
    inviU_admin: options.inviU_admin,
    })

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
    this.getRequest()

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