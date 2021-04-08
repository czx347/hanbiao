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
      page:1,
      inviUser:[],
      UserTotal:0,
      text:'加载中...',
      number:10,
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
        url: '../../my/my',
      })
    }else if (xBefore - xAfetr < -50 && Math.abs(yBefore - yAfetr) < 100){
      wx.switchTab({
        url: '../../user/history/history',
      })
    }
  },

  /**
   * 搜索
   */
  search(e){
    const that = this
    const search = e.detail || ''
    if(search == ''){
      this.getUsersNumber()
      return
    }
    this.setData({
      text:'搜索中...',
      page:1,
      inviUser:[],
      UserTotal:0,
    })
    wx.cloud.callFunction({
      name: 'searchUsers',
      data:{
        invi_detail:that.data.invitation,
        user_name:search,
        inviU_delete:0
      },
      success: function(res) {
          that.setData({
            inviUser:res.result.list,
            text:'--- 无数据啦 ---',
          })
      },
      fail: console.error  
    })
  },

  /**
   * 查询涵码下用户数量并获得首页数据
   */
  getUsersNumber(){
    const that = this
    that.setData({
      text:'加载中...',
      page:1,
      inviUser:[],
    })
    db.collection('inviUser').where({
      invi_detail: that.data.invitation,
      inviU_delete: 0
    }).count().then(res => {
      that.setData({
        UserTotal:res.total,
      })
      that.getUser()
    })
  },

  /**
   * 分页查询用户
   */
  getUser(){
    const that = this
    that.setData({
      text:'加载中...'
    })
    wx.cloud.callFunction({
      name: 'getUsers',
      data:{
        invi_detail:that.data.invitation,
        page:that.data.page,
        number:that.data.number,
      },
      success: function(res) {
        const UserTotal = that.data.UserTotal - that.data.number
        const inviUser = that.data.inviUser.concat(res.result.list)
        if(UserTotal > 0){
          that.setData({
            page: that.data.page + 1,
            inviUser:inviUser,
            text:'上拉加载新数据...',
            UserTotal:UserTotal
          })
        }else{
          that.setData({
            page: that.data.page + 1,
            inviUser:inviUser,
            text:'--- 无数据啦 ---',
            UserTotal:0
          })
        }
      },
      fail: console.error  
    })
  },

  /**
   * 拉黑
   */
  block(e){
    const that = this
    let inviUser = this.data.inviUser[e.currentTarget.dataset.idx]
    let inviU_block
    if(inviUser.inviU_block == 0){
      const user_name = inviUser.user[0].user_name|| ''
      wx.showModal({
        title: '提示',
        content: '是否确定将'+user_name+'拉黑？',
        success (res) {
          if (res.confirm) {
            inviU_block=1
            wx.cloud.callFunction({
              name: 'block',
              data: {
                user_id:inviUser.user_id,
                inviU_id:inviUser._id,
                inviU_block:inviU_block
              },
              success: res => {
                inviUser.inviU_block = inviU_block
                that.setData({
                  inviUser: that.data.inviUser
                })
              },
              fail: error =>{
                wx.showToast({
                  title: '操作失败',
                  icon: 'error',
                  duration: 2000
                }) 
                console.error  
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否确定将'+inviUser.user[0].user_name+'恢复？',
        success (res) {
          if (res.confirm) {
            inviU_block=0
            wx.cloud.callFunction({
              name: 'block',
              data: {
                inviU_id:inviUser._id,
                inviU_block:inviU_block
              },
              success: res => {
                inviUser.inviU_block = inviU_block
                that.setData({
                  inviUser: that.data.inviUser
                })
              },
              fail: error =>{
                wx.showToast({
                  title: '操作失败',
                  icon: 'error',
                  duration: 2000
                }) 
                console.error  
              }
            })
          }
        }
      })
    }

  },

  /**
   * 踢出
   */
  remove(e){
    const that = this
    const inviUser = this.data.inviUser[e.currentTarget.dataset.idx]
    const user_name = inviUser.user[0].user_name|| ''
    wx.showModal({
      title: '提示',
      content: '是否确定将'+user_name+'移出本涵码？',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '移除中',
          })
          wx.cloud.callFunction({
            name: 'deleteUser',
            data: {
              user:{
                id:inviUser.user[0]._id,
                invi_detail:''
              },
              inviUser:{
                invi_detail:that.data.invitation,
                user_id:inviUser.user[0]._id,
                inviU_delete:1
              },
            },
            success: res => {
              wx.hideLoading()
              that.data.inviUser.splice(e.currentTarget.dataset.idx,1)
              that.setData({
                inviUser:that.data.inviUser
              })
            },
            fail: error =>{
              wx.hideLoading()
              wx.showToast({
                title: '移除失败',
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
   * 跳转用户要求
   */
  userRequest(e){
    const number = e.currentTarget.dataset.idx
    const user_name = this.data.inviUser[number].user[0].user_name || ''
    const user_id = this.data.inviUser[number].user_id
    if(this.data.inviUser[number].inviU_admin === 1){
      wx.navigateTo({
        url: '../../userRequest/userRequest?user_name='+user_name+'&user_id='+user_id +'&inviU_admin=1',
      })
    }else{
      wx.navigateTo({
        url: '../../userRequest/userRequest?user_name='+user_name+'&user_id='+user_id +'&inviU_admin=0',
    })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    if(this.data.user_admin == 1){
      this.getUsersNumber()
    }

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
    if(this.data.user_admin == 0){
      wx.getStorage({
        key: 'add',
        success (res) {
          wx.switchTab({
            url: '../../user/history/history',
          })
          wx.removeStorage({
            key: 'add',
          })
        },
      fail(){
        wx.navigateTo({
          url: '../../user/add/add',
        })
      }
      })
    }

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
    if(this.data.user_admin == 1){
      if(this.data.UserTotal > 0){
        this.getUser()
      }
    }

  },
})