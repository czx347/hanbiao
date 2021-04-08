Page({

  /**
   * 页面的初始数据
   */
  data: {
    navAndStaHeight:
    wx.getStorageSync('statusBarHeight') +
    wx.getStorageSync('navigationBarHeight') - 1 +
    'px',
    disable:false,


  },

  /**
   * 获得基本信息
   */
  getData(){
    this.setData({
      openid:wx.getStorageSync('openid'),
      tempFilePaths:[],
      num:'num0',
    })
  },

  /**
   *上传图片
   */
  uploadImages(){
    const that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        wx.showLoading({
          title: '上传中',
        })
        let tempFilePaths = that.data.tempFilePaths
        for (const r of res.tempFilePaths) {
          const unixTimestamp = new Date()
          const data= unixTimestamp.getFullYear() + "-" + (unixTimestamp.getMonth() + 1) + "-" + unixTimestamp.getDate();
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: 'images/'+ data +'/'+ that.data.openid +'-'+Date.parse(new Date())+ (Math.random() * 10).toFixed() +'.png',
            // 指定要上传的文件的小程序临时文件路径
            filePath: r,
            // 成功回调
            success: res => {
              tempFilePaths = tempFilePaths.concat({
                imag_path:res.fileID,
                imag_detail:''
              })
              that.setData({
                tempFilePaths : tempFilePaths,
                num:'num' + (tempFilePaths.length - 1)
              })
              wx.setStorageSync('images', tempFilePaths)
              wx.hideLoading()    
            },
            fail(){
              wx.hideLoading()
              wx.showToast({
                title: '上传失败',
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
   * 删除图片
   */
  deleteImage(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    let tempFilePaths = this.data.tempFilePaths
    wx.showModal({
      title: '提示',
      content: '是否确定删除该图片?',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          wx.cloud.deleteFile({
            fileList: [tempFilePaths[number].imag_path]
          }).then(res => {
            tempFilePaths.splice(number * 1,1)
          that.setData({
            tempFilePaths: tempFilePaths,
          })
          wx.setStorageSync('images', tempFilePaths) 
           wx.hideLoading()
          }).catch(error => {
            wx.hideLoading()
            wx.showToast({
              title: '删除失败',
              icon: 'error',
              duration: 2000
               })
          })
        }
      }
    })
  },

  /**
   * 预览图片
   */
  preview(e) {
    let currentUrl = this.data.tempFilePaths[e.currentTarget.dataset.idx].imag_path
    let urls = this.data.tempFilePaths.map((x) =>{
      return x.imag_path
    })
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: urls
    })
  },

  /**
   * 绑定备注
   */
  bindText(e){
    const number = e.currentTarget.dataset.idx
    const imag_detail = 'tempFilePaths[' + number + '].imag_detail'
    this.setData({
      [imag_detail]: e.detail.value
    })
    wx.setStorageSync('images', this.data.tempFilePaths) 
  },

  /**
   * 获取图片
   */
  getImages(options){
    const that = this
    wx.getStorage({
      key: 'images',
      success (res) {
        
        wx.getStorage({
          key: 'disable',
          success (res) {
            if(res.data != ''){
              that.setData({
                disable:res.data
              })
            }
          }
        })
        if(res.data == ''){
          that.setData({
            tempFilePaths:[]
          })
          return
        }
        if(options.id == undefined){
          that.setData({
            tempFilePaths:res.data
          })
        }else{
          that.setData({
            tempFilePaths:res.data,
            num:options.id
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getImages(options)

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