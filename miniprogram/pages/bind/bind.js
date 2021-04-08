const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0 ,
    ing: 0,
    type: 0,
    invitation:'',
    password:'',
    checkPassword:'',
    id:'',
    openid:'',
    Loading:1,
    tempInvitation:''

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
   * 检查是否已经登录
   */
  isLogin:function(){
    const that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: function(res) {
        const openid = res.result.openid
        db.collection('user').where({
          user_id: openid,
          user_delete: 0
        }).get().then(res => {
            //确保用户曾经登录过
          if (res.data == "") {
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                user_id:openid,
                user_name:'',
                user_photo:'',
                invi_detail:'',
                user_admin:0,
                user_time:Date(),
                user_delete: 0
              },
              success: res => {
                that.isLogin()
              },
              fail(){
                wx.showToast({
                  title: '注册失败',
                  icon: 'error',
                  duration: 2000
                })
              } 
            })
          }else{
            that.setData({
              id: res.data[0]._id,
              openid: openid,
            })
            wx.setStorageSync('openid', res.data[0]._id)
            if(that.data.tempInvitation != ''){
              that.setData({ 
                invitation:that.data.tempInvitation,
              })
              wx.hideLoading()
              that.setData({
                Loading:0
              })
              return
            }
            if(res.data[0].invi_detail != '')
            {
              wx.setStorageSync('invitation', res.data[0].invi_detail)
              wx.setStorageSync('user_admin', res.data[0].user_admin)
              if(res.data[0].user_admin == 1){
                db.collection('formStyle').where({
                  invi_detail: res.data[0].invi_detail,
                  formS_delete: 0
                }).get().then(res => {
                  if(res.data == ''){
                    wx.redirectTo({
                      url: '../admin/edit/edit'
                    })
                  }else{
                    wx.switchTab({
                      url: '../user/history/history',
                     })
                  }
                })
              }else{
                wx.switchTab({
                  url: '../user/history/history',
                 })
              }
            }else{ 
            wx.hideLoading()
              that.setData({
                Loading:0
              })
            }
          }
        })
      },
      fail: console.error,
    })
  },

   /**
   * 绑定数据
   */
  bindDate(e) {
    this.setData({
      [e.currentTarget.dataset.idx]:e.detail.value
    })
  },

   /**
   * 检查是否填写
   */
  checkNull() {
    if(this.data.currentTab == 0){
      if(this.data.invitation === ''){
        wx.showToast({
          title: '请填写完整数据!',
          icon: 'error',
          duration: 2000
        })
        return false
      }
    }else{
      if(this.data.type === '' || this.data.invitation === '' ||this.data.password === '' ){
        wx.showToast({
          title: '请填写完整数据!',
          icon: 'error',
          duration: 2000
        })
        return false
      }
      if(this.data.type == 0 && this.data.password !== this.data.checkPassword){
        wx.showToast({
          title: '请输入相同密码!',
          icon: 'error',
          duration: 2000
        })
        return false
      }
    }
    return true
  },

  /**
   * 绑定
   */
  bind() {
    const that = this
    if(this.checkNull()){
      this.setData({
        ing:1
      })
      if(that.data.currentTab == 0){//用户加入
        db.collection('invitation').where({
          invi_detail: that.data.invitation,
          invi_delete: 0
        }).get().then(res => {
          if(res.data == ''){//涵码错误
            wx.showToast({
              title: '涵码错误!',
              icon: 'error',
              duration: 2000
            })   
            this.setData({
              ing:0
            })
          }else{
            db.collection('inviUser').where({
              invi_detail: that.data.invitation,
              user_id: that.data.id,
              inviU_delete: 0
            }).get().then(res => {
              if(res.data == ''){//加入新涵码
                that.join(0)
              }else if(res.data[0].inviU_block == 1){//被拉黑
                wx.showToast({
                  title: '你已被拉黑!',
                  icon: 'error',
                  duration: 2000
                })   
                this.setData({
                  ing:0
                })  
              }else{//加入已有涵码
                that.updataUser(res.data[0].inviU_admin)
              }  
            })
          }
        })
      }else{
        if(that.data.type == 0){//管理员创建
          db.collection('invitation').where({
            invi_detail: that.data.invitation,
            invi_delete: 0
          }).get().then(res => {
            if(res.data == ''){
              that.create()
            }else{
              wx.showToast({
                title: '涵码已存在!',
                icon: 'error',
                duration: 2000
              })
              this.setData({
                ing:0
              })
            }
          })
        }else{//管理员加入
          db.collection('invitation').where({
            invi_detail: that.data.invitation,
            invi_password: that.data.password,
            invi_delete: 0
          }).get().then(res => {
            if(res.data == ''){
              wx.showToast({
                title: '信息错误!',
                icon: 'error',
                duration: 2000
              })
              this.setData({
                ing:0
              })
            }else{
              db.collection('inviUser').where({
                invi_detail: that.data.invitation,
                user_id: that.data.id,
                inviU_delete: 0
              }).get().then(res => {
                if(res.data == ''){
                  that.join(1)
                }else if(res.data[0].inviU_block == 1){
                  wx.showToast({
                    title: '你已被拉黑!',
                    icon: 'error',
                    duration: 2000
                  })   
                  this.setData({
                    ing:0
                  })  
                }else{//加入已有涵码
                  that.updataUser(res.data[0].inviU_admin)
                }  
              })
            }
          })
        }
      }
    }
  },

  /**
   *加入已加入的涵码
   */
  updataUser(user_admin){
    const that =this
    wx.cloud.callFunction({
      name: 'updataUser',
      data: {
          user_id: that.data.id,
          invi_detail: that.data.invitation,
          user_admin: user_admin,
      },
      success: res => {
        console.res
        wx.setStorageSync('invitation', that.data.invitation)
        wx.setStorageSync('user_admin', user_admin)
        wx.switchTab({
          url: '../user/history/history',
        })
      },
      fail: console.error  
    })        
  },

   /**
   *加入
   */
  join(inviU_admin) {
    const that = this
    wx.cloud.callFunction({
      name: 'join',
      data: {
        inviUser:{
          invi_detail: that.data.invitation,
          user_id: that.data.id,
          inviU_admin: inviU_admin,
          inviU_block: 0,
          inviU_delete: 0,
        },
        user:{
          user_id:that.data.id,
          invi_detail: that.data.invitation,
          user_admin: inviU_admin,
        }
      },
      success: res => {
        wx.setStorageSync('invitation', that.data.invitation)
          wx.setStorageSync('user_admin', inviU_admin)
          wx.switchTab({
            url: '../user/history/history',
          })
      },
      fail: console.error  
    })
  },

  /**
   *创建
   */
  create() {
    const that = this
    wx.cloud.callFunction({
      name: 'create',
      data: {
        inviUser:{
          invi_detail: that.data.invitation,
          user_id: that.data.id,
          inviU_admin: 1,
          inviU_block: 0,
          inviU_delete: 0,
        },
        user:{
          user_id:that.data.id,
          invi_detail: that.data.invitation,
          user_admin: 1,
        },
        invitation:{
          invi_detail:that.data.invitation,
          invi_password:that.data.password,
          invi_time:Date(),
          invi_delete:0,
          user_id:that.data.id,
        }
      },
      success: res => {
        wx.setStorageSync('invitation', that.data.invitation)
          wx.setStorageSync('user_admin', 1)
          wx.redirectTo({
            url: '../admin/edit/edit'
          })
      },
      fail: console.error  
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    if(options.invitation != undefined){
      this.setData({
        tempInvitation:options.invitation
      })
    }
    this.isLogin()
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