const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation:'',
    openid:'',
  },

  /**
   * 获得基本信息
   */
  getData(){
    this.setData({
      openid:wx.getStorageSync('openid'),
      invitation:wx.getStorageSync('invitation'),
      anno_name:'',
      announcement:[],
      bottom:''
    })
  },

  /**
   * 清空
   */
  clear(){
    this.setData({
      anno_name:''
    })
  },

   /**
   * 绑定通知输入
   */
  bindInform(e){
    this.setData({
      anno_name: e.detail.value
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
   * 获得历史通知
   */
  getAnnouncement(){
    const that = this
    that.setData({
      bottom:'加载中...',
    })
    db.collection('announcement').where({
      invi_detail: that.data.invitation,
      anno_delete: 0
    }).orderBy('anno_time','desc').get().then(res => {
      if(res.data != '')
      {
        for(let r of res.data){
          r.anno_time= that.format(new Date(r.anno_time));
        }
        that.setData({
          announcement:res.data,
        })
        if(res.data[0].anno_live == 1){
          that.setData({
            anno_name:res.data[0].anno_name,
          })
        }
      }
      that.setData({
        bottom:'--- 没数据啦 ---',
      })
    })
  },

  /**
   * 保存
   */
  save(){
    const that = this
    if(that.data.anno_name == ''){
      if(that.data.announcement[0].anno_live == 1){
        wx.showLoading({
          title: '发布中',
        })
        wx.cloud.callFunction({
          name: 'deleteInform',
          data: {
            anno_id:that.data.announcement[0]._id,
            anno_live:0,
            anno_delete:0
          },
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
            }) 
            wx.setStorage({
              data: 'updataInform',
              key: 'updataInform',
            })
          },
          fail: error =>{
            wx.showToast({
              title: '删除失败',
              icon: 'error',
              duration: 2000
            }) 
            console.error  
          }
        })
      }
    }else{
      wx.showLoading({
        title: '发布中',
      })
      wx.cloud.callFunction({
        name: 'saveInform',
        data: {
          invi_detail:that.data.invitation,
          anno_name:that.data.anno_name,
          anno_delete:0,
          anno_live:1,
          anno_creator:that.data.openid,
          anno_time: Date(),
          // anno_time: that.formatDate(),
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          }) 
          that.getAnnouncement()
          wx.setStorage({
            data: 'updataInform',
            key: 'updataInform',
          })
        },
        fail: error =>{
          wx.showToast({
            title: '发布失败',
            icon: 'error',
            duration: 2000
          }) 
          console.error  
        }
      })
    }
  },

    /**
   * 删除
   */
  delete(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    wx.cloud.callFunction({
      name: 'deleteInform',
      data: {
        anno_id:that.data.announcement[number]._id,
        anno_live:0,
        anno_delete:1
      },
      success: res => {
        that.getAnnouncement()
      },
      fail: error =>{
        wx.showToast({
          title: '删除失败',
          icon: 'error',
          duration: 2000
        }) 
        console.error  
      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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