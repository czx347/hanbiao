const db = wx.cloud.database();
const _ = db.command
let xBefore
let xAfetr
let yBefore
let yAfetr
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏和状态栏高度
    navigationBarAndStatusBarHeight:
      wx.getStorageSync('statusBarHeight') +
      wx.getStorageSync('navigationBarHeight') +
      'px',


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
      request:[],
      requestTotal:0,
      currentTab: 2 ,
      text:'加载中...',
      number:10,
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
   * 搜索
   */
  search(e){
    const that = this
    const search = e.detail || ''
    if(search == ''){
      this.getRequestNumber()
      return
    }
    that.setData({
      page:1,
      request:[],
      requestTotal:0,
      text:'搜索中...'
    })
    wx.cloud.callFunction({
      name: 'searchRequest',
      data:{
        req_title:search,
        currentTab:that.data.currentTab,
        user_id:that.data.openid,
        user_admin:that.data.user_admin,
        invi_detail:that.data.invitation,
        req_delete:0,
      },
      success: function(res) {
        let list = res.result.list
        for (const l of list) {
          l.req_time= that.format(new Date(l.req_time));
        }
          that.setData({
            request:list,
            text:'--- 无数据啦 ---',
            requestTotal:0
          })
      },
      fail: console.error  
    })
  },

    /**
   * 查询涵码下用户数量并获得首页数据
   */
  getRequestNumber(){
    const that = this
    const data = this.data
    that.setData({
      text:'加载中...',
      page:1,
      request:[],
      requestTotal:0,
    })
    if(data.user_admin == 1){     //管理员
      if(data.currentTab == 2){   //未审核
        db.collection('request').where({
          invi_detail: data.invitation,
          req_state: 2,
          req_delete: 0
        }).count().then(res => {
          that.setData({
            requestTotal:res.total,
          })
          that.getRequest()
        })

      }else{                             //已审核
        db.collection('request').where({
          invi_detail: data.invitation,
          req_state:_.gte(3),
          req_delete: 0
        }).count().then(res => {
          that.setData({
            requestTotal:res.total,
          })
          that.getRequest()
        })

      }
    }else{                              //用户
      if(data.currentTab == 2){         //未审核
        db.collection('request').where({
          user_id: data.openid,
          req_state: _.lte(2),
          req_delete: 0
        }).count().then(res => {
          that.setData({
            requestTotal:res.total,
          })
          that.getRequest()
        })

      }else{                               //已审核
        db.collection('request').where({
          user_id: data.openid,
          req_state:_.gte(3),
          req_delete: 0
        }).count().then(res => {
          that.setData({
            requestTotal:res.total,
          })
          that.getRequest()
        })

      }
    }
  },

  /**
   * 分页查询请求
   */
  getRequest(){
    const that = this
    that.setData({
      text:'加载中...'
    })
    wx.cloud.callFunction({
      name: 'getRequest',
      data:{
        currentTab:that.data.currentTab,
        user_id:that.data.openid,
        user_admin:that.data.user_admin,
        invi_detail:that.data.invitation,
        page:that.data.page,
        number:that.data.number,
        req_delete:0,
      },
      success: function(res) {
        const requestTotal = that.data.requestTotal - that.data.number
        let list = res.result.list
        for (const l of list) {
          l.req_time= that.format(new Date(l.req_time));
        }
        const request = that.data.request.concat(list)
        if(requestTotal > 0){
          that.setData({
            page: that.data.page + 1,
            request:request,
            text:'上拉加载新数据...',
            requestTotal:requestTotal
          })
        }else{
          that.setData({
            page: that.data.page + 1,
            request:request,
            text:'--- 无数据啦 ---',
            requestTotal:0
          })
        }
      },
      fail: console.error  
    })
  },

  /**
   * 跳转详细
   */
  requestDetail(e){
    const number = e.currentTarget.dataset.idx
    const req_id = this.data.request[number]._id
    wx.navigateTo({
      url: '../add/add?req_id=' + req_id,
    })
  },

  /**
   * 提交
   */
  submit(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    const request = this.data.request
    wx.showModal({
      title: '提示',
      content: '是否提交' +request[number].req_title + '?',
      success (res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: ['GvE7iYbGFI7eymCymjd6h5NNyn7z3TCpMByn5UnrBVc'],
            complete(){
              wx.cloud.callFunction({
                name: 'updataRequestState',
                data:{
                  req_id:request[number]._id,
                  req_state:2,
                  req_time:Date(),
                },
                success: function(res) {
                  const req_state = 'request['+ number + '].req_state'
                  that.setData({
                    [req_state]:2
                  })
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail(){
                  wx.showToast({
                    title: '提交失败',
                    icon: 'error',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 删除
   */
  delete(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    const request = this.data.request
    wx.showModal({
      title: '提示',
      content: '是否删除' +request[number].req_title + '?',
      success (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteRequest',
            data:{
              req_id:request[number]._id,
              req_delete:1
            },
            success: function(res) {
              request.splice(number,1)
              that.setData({
                request:that.data.request
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(){
              wx.showToast({
                title: '删除失败',
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
   * 用户撤回
   */
  UserRecall(e){
    const that = this
    const number = e.currentTarget.dataset.idx
    const request = this.data.request
    wx.showModal({
      title: '提示',
      content: '是否撤回' +request[number].req_title + '?',
      success (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updataRequestState',
            data:{
              req_id:request[number]._id,
              req_state:1,
              req_time:Date(),
            },
            success: function(res) {
              const req_state = 'request['+ number + '].req_state'
              that.setData({
                [req_state]:1
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
              request.splice(number,1)
              that.setData({
                request
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
    const data = this.data
    xAfetr = e.changedTouches[0].clientX;
    yAfetr = e.changedTouches[0].clientY;
    if(xBefore - xAfetr > 50 && Math.abs(yBefore - yAfetr) < 100){
      if(data.currentTab == 2){
        this.setData({ 
          currentTab: 3,
          page:1,
          request:[],
         }) 
         this.getRequestNumber()
      }else{
        wx.switchTab({
          url: '../../admin/userManagement/userManagement',
        })
      }
    }else if (xBefore - xAfetr < -50 && Math.abs(yBefore - yAfetr) < 100){
      if(data.currentTab == 3){
        this.setData({ 
          currentTab: 2,
          page:1,
          request:[],
         }) 
         this.getRequestNumber()
      }else{
        wx.switchTab({
          url: '../../my/my',
        })
      }
    }
  },

   /**
   * 导航栏
   */
  navbarTap:function(e){
    this.setData({ 
      currentTab: e.currentTarget.dataset.idx ,
      page:1,
      request:[],
     }) 
     this.getRequestNumber()

  },

  /**
   * 更换管理导航
   */
  changeTab() {
    if(this.data.user_admin == 1){
      wx.setTabBarItem({
        index: 0,
        text: '审核',
        iconPath: 'images/shenghe.png',
        selectedIconPath: 'images/shengheAfter.png'
      })
      wx.setTabBarItem({
        index: 1,
        text: '用户',
        iconPath: 'images/user.png',
        selectedIconPath: 'images/userAfter.png'
      })
    }else{
      wx.setTabBarItem({
        index: 0,
        text: '历史',
        iconPath: 'images/history.png',
        selectedIconPath: 'images/historyAfter.png'
      })
      wx.setTabBarItem({
        index: 1,
        text: '增加',
        iconPath: 'images/add.png',
        selectedIconPath: 'images/addAfter.png'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.changeTab()
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
    this.getRequestNumber()

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
    if(this.data.requestTotal > 0){
      this.getRequest()
    }

  },
})