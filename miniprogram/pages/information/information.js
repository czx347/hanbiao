const db = wx.cloud.database();
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
      user:'',
      Dialog:false,
    })
  },

  /**
   * 获得用户信息
   */
  getUser() {
    const that = this
    db.collection('user').doc(that.data.openid).get().then(res => {
      if(res.data.user_photo == ''){
        that.setData({
          user:res.data,
          Dialog:true
        })
      }else{
        that.setData({
          user:res.data
        })
      }
    })
  },

  /**
   * 修改昵称
   */
  updataName(e){
    const that = this
    if(e.detail.value == ''){
      wx.showToast({
        title: '昵称不能为空',
        icon: 'error',
        duration: 2000
      }) 
      return
    }
    wx.cloud.callFunction({
      name: 'updataName',
      data: {
          user_id: that.data.user._id,
          user_name: e.detail.value,
          user_photo: '',
      },
      success: res => {
        wx.setStorage({
          data: 'updataName',
          key: 'updataName',
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })        
      },
      fail: console.error  
    })        
  },

    /**
   * 获得头像
   */
  GetUserInfo(e) {
    wx.showLoading({
      title: '上传中',
    })
    this.close()
    const that = this
    const userInfo = e.detail.userInfo
    wx.getImageInfo({
      src: userInfo.avatarUrl,
      success: function (sres) {       //访问存放微信用户头像的Url 
        const unixTimestamp = new Date()
        const data= unixTimestamp.getFullYear() + "-" + (unixTimestamp.getMonth() + 1) + "-" + unixTimestamp.getDate();
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'headPortrait/'+ data +'/'+ userInfo.nickName +'-'+Date.parse(new Date())+ (Math.random() * 10).toFixed() +'.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: sres.path,
          // 成功回调
          success: res => {
            const user_photo = res.fileID
            const user_name = userInfo.nickName
            wx.cloud.callFunction({
              name: 'updataName',
              data: {
                  user_id: that.data.user._id,
                  user_name: user_name,
                  user_photo: user_photo,
              },
              success: res => {
                that.setData({
                  ['user.user_photo']:user_photo,
                  ['user.user_name']:user_name
                })
                wx.hideLoading()
                wx.setStorage({
                  data: 'updataName',
                  key: 'updataName',
                })
              },
              fail(){
                wx.hideLoading()
                wx.showToast({
                  title: '获取失败',
                  icon: 'error',
                  duration: 2000
                })
              }   
            })
          },
          fail(){
            wx.hideLoading()
            wx.showToast({
              title: '获取失败',
              icon: 'error',
              duration: 2000
            })
          }  
        })
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      } 
    })
  },

  /**
   * 修改头像
   */
  updataImage(user_photo){
    const that = this
    wx.cloud.callFunction({
      name: 'updataName',
      data: {
          user_id: that.data.user._id,
          user_photo: user_photo,
          user_name:'',
      },
      success: res => {
        wx.setStorage({
          data: 'updataName',
          key: 'updataName',
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })        
      },
      fail: console.error  
    })        
  },

  /**
   * 获得修改头像
   */
  getImage(){
    const that = this
    wx.getStorage({
      key: 'image',
      success (res) {
        const user_photo = that.data.user.user_photo
        that.setData({
          ['user.user_photo']:res.data
        })
        wx.removeStorage({
          key: 'image',
        })
        const unixTimestamp = new Date()
        const data= unixTimestamp.getFullYear() + "-" + (unixTimestamp.getMonth() + 1) + "-" + unixTimestamp.getDate();
          wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'headPortrait/'+ data +'/' +Date.parse(new Date())+ (Math.random() * 10).toFixed() +'.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: res.data,
          // 成功回调
          success: function (res) {
            const fileID = res.fileID
            if(user_photo == ''){
              that.updataImage(fileID)
            }else{
              wx.cloud.deleteFile({
                fileList: [user_photo]
              }).then(res => {
                that.updataImage(fileID)
              }).catch(error => {
                wx.showToast({
                  title: '删除失败',
                  icon: 'error',
                  duration: 2000
                  })
              })
            }
          },
          fail: function (error) {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            })
          },
        })
      }
    })
  },

  /**
   * 获得修改头像
   */
  close(){
    const Dialog = this.selectComponent("#Dialog"); 
    Dialog.close()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getUser()

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
    this.getImage()

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