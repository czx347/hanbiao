const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏和状态栏高度
    navAndStaHeight:
    wx.getStorageSync('statusBarHeight') +
    wx.getStorageSync('navigationBarHeight') - 1 +
    'px',

  },

    /**
   * 获得基本信息
   */
  getData(){
    this.setData({
      openid:wx.getStorageSync('openid'),
      invitation:wx.getStorageSync('invitation'),
      num:'num1',
      currentTab: true ,
      formS_style:[{
        formS_type: '短文本(主标题)',
        show:true,
        formS_title:'',
        formS_must: true,
        formS_detail:'',
      }],
      back:true
    })
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
    if(type === '单选' ||type === '多选')
    {
      this.data.formS_style.push({
        formS_title:'',
        formS_must: true,
        formS_type: type,
        show:true,
        formS_detail:['']
      })
    }else if(type === '定位'){
      this.data.formS_style.push({
        formS_title:'',
        formS_must: true,
        formS_type: type,
        show:true,
        formS_detail:true
      })
    }else{
      this.data.formS_style.push({
        formS_title:'',
        formS_must: true,
        formS_type: type,
        show:true,
        formS_detail:'',
      })
    }
    this.setData({
      formS_style: this.data.formS_style,
      num: 'num'+ (this.data.formS_style.length - 1)
    })
  },

  /**
   *删除数据类型
   */
  deleteFormStyle:function(e){
    const number = e.currentTarget.dataset.idx
    this.data.formS_style.splice(number * 1,1)
    this.setData({
      formS_style: this.data.formS_style
    })

  },

   /**
   *删除选项
   */
  deleteOption:function(e){
    const idx = e.currentTarget.dataset.idx
    const number = idx.split('+')
    this.data.formS_style[number[0]].formS_detail.splice(number[1] * 1,1)
    this.setData({
      formS_style: this.data.formS_style
    })

  },

  /**
   *增加选项
   */
  addOption:function(e){
    const number = e.currentTarget.dataset.idx
    this.data.formS_style[number].formS_detail.push('')
    this.setData({
      formS_style: this.data.formS_style
    })
  },

   /**
   *展开
   */
  show:function(e){
    const show = 'formS_style[' + e.currentTarget.dataset.idx + '].show'
    this.setData({
      [show]:e.detail.value
    })

  },

  /**
   *检查是否填完
   */
  isNull(){
    const formS_style = this.data.formS_style
    for(const f of formS_style){
      if(f.formS_type === '多选' || f.formS_type === '单选'){
        if(f.formS_title == ''){
          return true
        }
        for(const s of f.formS_detail){
          if(s == ''){
            return true
          }
        }
      }else{
        if(f.formS_title == ''){
          return true
        }
      }
    }
    return false
  },

   /**
   * 绑定标题
   */
  bindTitle(e){
    const number = e.currentTarget.dataset.idx
    const formS_title = 'formS_style[' + number + '].formS_title'
    this.setData({
      [formS_title]: e.detail.value
    })
  },

  /**
   * 绑定选项
   */
  bindOption(e){
    const idx = e.currentTarget.dataset.idx
    const number = idx.split('+')
    const formS_detail = 'formS_style[' + number[0] + '].formS_detail[' + number[1] + ']'
    this.setData({
      [formS_detail]: e.detail.value
    })
  },

  /**
   * 绑定是否必填
   */
  bindIsMust(e){
    const number = e.currentTarget.dataset.idx
    const formS_must = 'formS_style[' + number + '].formS_must'
    this.setData({
      [formS_must]: e.detail.value
    })
  },

  /**
   * 保存
   */
  save(){
    const that = this
    if(that.isNull()){
      wx.showToast({
        title: '信息未填写完整',
        icon: 'error',
        duration: 2000
      }) 
      return
    }
    wx.showLoading({
      title: '保存中',
    })
    wx.cloud.callFunction({
      name: 'saveFormStyle',
      data: {
        invi_detail:that.data.invitation,
        formS_creator:that.data.openid,
        formS_style:that.data.formS_style,
        formS_delete:0,
        formS_live:1
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        if(!that.data.back){ 
          wx.switchTab({
            url: '../../user/history/history',
          })
          that.setData({
            back:true
          })
        }
      },
      fail: error =>{
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        }) 
        console.error  
      }
    })
  },

  /**
   * 绑定是否手选
   */
  bindManual(e){
    const number = e.currentTarget.dataset.idx
    const formS_detail = 'formS_style[' + number + '].formS_detail'
    this.setData({
      [formS_detail]: e.detail.value
    })
  },

  /**
   * 获得样式
   */
  getFormStyle(){
    const that = this
    db.collection('formStyle').where({
      invi_detail: that.data.invitation,
      formS_delete: 0,
      formS_live:1
    }).get().then(res => {
      if(res.data != '')
      {
        that.setData({
          formS_style:res.data[0].formS_style
        })
      }else{
        that.setData({
          back:false
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getFormStyle()


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
    this.setData({
      back:true
    }) 

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