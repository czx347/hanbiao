const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      user_admin:wx.getStorageSync('user_admin'),
      currentTab:true,
      bottom:'加载中...',
      anno_name:'加载中...',
      req_state:'',
      formStyle:[],
      reqD_inform:[],
      req_id:'',
      requestDetail_id:'',
      option:'',
      disable:false,
      invi_detail:[],
      detailIndex:'',
      requestId:[],
      idIndex: '',
    })
  },

  /**
   * 更换涵码
   */
  changeInvitation(e){
    this.setData({
      detailIndex:e.detail.value,
      invitation: this.data.invi_detail[e.detail.value],
      bottom:'加载中...',
      anno_name:'加载中...',
      formStyle:[],
      reqD_inform:[],
      req_id:'',
      requestDetail_id:'',
    })
    this.getFormStyle()
    this.getAnnouncement(this.data.invitation)
  },

  /**
   *获得历史涵码
   */
  getInvitation(){
    const that = this
    db.collection('inviUser').where({
      user_id: that.data.openid,
      inviU_admin:0,
      inviU_delete: 0
    }).get().then(res => {
      let invi_detail=[]
      const data = res.data
      for (const r in res.data) {
        invi_detail = invi_detail.concat(data[r].invi_detail)
        if(data[r].invi_detail === that.data.invitation){
          that.setData({
            detailIndex:r
          })
        }
      }
      that.setData({
        invi_detail
      })
    })
  },

  /**
   * 展示通知
   */
  showInform(){
    const anno_name = this.data.anno_name || '无通知'
    wx.showModal({
      title: '通知',
      content: anno_name,
    })
  },

  /**
   * 获得通知
   */
  getAnnouncement(invitation){
    const that = this
    if(this.data.req_state <= 2){
      db.collection('announcement').where({
        invi_detail: invitation,
        anno_live:1,
        anno_delete: 0
      }).get().then(res => {
        if(res.data != ''){
          that.setData({
            anno_name:res.data[0].anno_name,
          })
        }else{
          that.setData({
            anno_name:'',
          })
        }
      })
    }
  },

    /**
   * 导航栏
   */
  navbarTap(){
    this.setData({
      currentTab: !this.data.currentTab
    })
  },

  /**
   * 获得涵码最新样式
   */
  getFormStyle(){
    const that = this
    db.collection('formStyle').where({
      invi_detail: that.data.invitation,
      formS_delete: 0,
      formS_live:1
    }).get().then(res => {
      if(res.data != ''){
        that.setData({
          req_state:0,
          formStyle:res.data
        })
      this.getInitialReqD_inform()
      }else{
        that.setData({
          bottom:'请联系管理员添加表格!'
        })
      }
    })
  },

  /**
   * 绑定文本内容
   */
  bindText(e){
    const number = e.currentTarget.dataset.idx
    const reqD_detail = 'reqD_inform[' + number + '].reqD_detail'
    this.setData({
      [reqD_detail]: e.detail.value
    })
  },

  /**
   * 绑定多选
   */
  bindCheckbox(e){
    const number = e.currentTarget.dataset.idx
    const value = e.detail.value
    const tempReqD_detail = this.data.reqD_inform[number].reqD_detail
    for (const r of tempReqD_detail) {
      r.checked = false
      for (const v of value) {
        if(r.value === v){
          r.checked = true
          break
        }
      }
    }
    const reqD_detail = 'reqD_inform[' + number + '].reqD_detail'
    this.setData({
      [reqD_detail]: tempReqD_detail
    })
  },

  /**
   * 绑定单选
   */
  bindRadio(e){
    const number = e.currentTarget.dataset.idx
    const value = e.detail.value
    const tempReqD_detail = this.data.reqD_inform[number].reqD_detail
    for (const r of tempReqD_detail) {
      r.checked = false
      if(r.value == value){
        r.checked = true
      }
    }
    const reqD_detail = 'reqD_inform[' + number + '].reqD_detail'
    this.setData({
      [reqD_detail]: tempReqD_detail
    })
  },

  /**
   * 检查必填
   */
  checkNull(){
    const formStyle = this.data.formStyle
    const reqD_inform = this.data.reqD_inform
    for (const i in reqD_inform) {
      if (formStyle[0].formS_style[i].formS_must == true && reqD_inform[i].reqD_detail == '') {
        return false
      }else if(formStyle[0].formS_style[i].formS_type == '多选' && formStyle[0].formS_style[i].formS_must == true){
        for (const r in reqD_inform[i].reqD_detail) {
          if(reqD_inform[i].reqD_detail[r].checked == true){
            break
          }
          if(r == reqD_inform[i].reqD_detail.length - 1){
            return false
          }
        }
      }else if(formStyle[0].formS_style[i].formS_type == '单选' && formStyle[0].formS_style[i].formS_must == true){
        for (const r in reqD_inform[i].reqD_detail) {
          if(reqD_inform[i].reqD_detail[r].checked == true){
            break
          }
          if(r == reqD_inform[i].reqD_detail.length - 1){
            return false
          }
        }
      }
    }
    return true
  },

  /**
   * 保存数据库
   */
  addRequestDetail(req_state){
    const that = this
    wx.cloud.callFunction({
      name: 'addRequestDetail',
      data:{
        request:{
          _id: that.data.req_id,
          invi_detail: that.data.invitation,
          req_check: '',
          req_state: req_state,
          req_reply: '',
          req_title: that.data.reqD_inform[0].reqD_detail,
          user_id: that.data.openid,
          req_time: Date(),
          req_delete: 0,
        },
        requestDetail:{
          _id: that.data.requestDetail_id,
          reqD_inform: that.data.reqD_inform,
          req_state	: req_state,
          formS_id: that.data.formStyle[0]._id,
          req_id: that.data.req_id,
          reqD_delete: 0,
        },
      },
      success: function(res) {
        that.setData({
          reqD_inform:[],
        })
        wx.hideLoading()
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail(error){
        console.log(error);
        wx.hideLoading()
        wx.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 2000
        })
      }    
    })
  },

  /**
   * 获得未审核的数据id
   */
  getRequest(){
    if(this.data.user_admin == 1 && this.data.req_state == 2 ){
      const that = this
      db.collection('request').where({
        invi_detail: that.data.invitation,
        req_state: 2,
        req_delete: 0
      })
      .field({
        _id: true,
      })
      .get({
        success: function(res) {
          const data = res.data
          let idIndex = 0
          let requestId = []
          data.forEach((v, i) => {
            requestId.push(v._id)
            if(v._id == that.data.req_id){
              idIndex = i;
            }
          })
          that.setData({
            requestId: requestId,
            idIndex: idIndex
          })
        }
      })
    }
  },

   /**
   * 保存
   */
  save(){
    if(this.checkNull()){
      wx.showLoading({
        title: '保存中',
      })
      this.addRequestDetail(1)
    }else{
      wx.showToast({
        title: '还有星号栏未填',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 提交
   */
  submit(){
    const that = this
    if(this.checkNull()){
      // this.addRequestDetail(2)
      wx.requestSubscribeMessage({
        tmplIds: ['GvE7iYbGFI7eymCymjd6h5NNyn7z3TCpMByn5UnrBVc'],
        complete(){
          wx.showLoading({
            title: '提交中',
          })
          that.addRequestDetail(2)
         }
      })
    }else{
      wx.showToast({
        title: '还有星号栏未填',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 上传图片
   */
  upload(e){
    const index = e.currentTarget.dataset.idx+''
    const idx = index.split(' ')
    wx.setStorageSync('idx', idx[0])
    wx.setStorageSync('disable', this.data.disable)
    wx.setStorageSync('images', this.data.reqD_inform[idx[0]].reqD_detail)
    if(idx.length == 1){
      wx.navigateTo({
        url: '../../uploadImage/uploadImage',
      })
    }else{
      wx.navigateTo({
        url: '../../uploadImage/uploadImage?id=num'+idx[1],
      })   
    }
  },

  /**
   * 绑定意见
   */
  bindOpinion(e){
    this.setData({
      option:e.detail.value
    })
  },

    /**
   * 获取图片
   */
  getImages(){
    const that = this
    wx.getStorage({
      key: 'idx',
      success (res) {
        const idx = res.data
        wx.getStorage({
          key: 'images',
          success (res) {
            const reqD_detail ='reqD_inform['+idx+'].reqD_detail'
            that.setData({
              [reqD_detail]:res.data
            })
            wx.removeStorageSync('idx')
            wx.removeStorageSync('images')
            wx.removeStorageSync('disable')
          }
        })
      }
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
      return Y + '年' + M + '月' + D + '日 ' + H + ':' + Mi + ':' + S;
  },

  /**
   * 审核
   */
  audit(e){
    wx.showLoading({
      title: '提交中',
    })
    const that = this
    const req_state = e.currentTarget.dataset.idx * 1
    wx.cloud.callFunction({
      name: 'audit',
      data:{
        req_id:that.data.req_id,
        req_check: that.data.openid,
        req_state: req_state,
        req_reply: that.data.option,
        req_time: Date(),
      },
      success: function(res) {
        wx.cloud.callFunction({
          name: 'sendAudit',
          data:{
            req_id:that.data.req_id,
            req_state: req_state,
            req_title: that.data.reqD_inform[0].reqD_detail,
            req_time: that.format(new Date()),
            req_reply: that.data.option,
          },
          fail(error){
            console.log(error)
          }
        })
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        let requestId = that.data.requestId
        let idIndex = that.data.idIndex
        requestId.splice(idIndex,1)
        if(requestId.length > 0){
          idIndex = (idIndex + 1) % requestId.length
          that.getReqD_inform(requestId[idIndex])
        }else{
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '提交失败',
          icon: 'error',
          duration: 2000
        })
      }
    })

  },

  /**
   * 删除图片
   */
  deleteImage(e){
    const that = this
    const index = e.currentTarget.dataset.idx+''
    const idx = index.split(' ')
    let reqD_detail = this.data.reqD_inform[idx[0]].reqD_detail
    wx.showModal({
      title: '提示',
      content: '是否确定删除该图片?',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          wx.cloud.deleteFile({
            fileList: [reqD_detail[idx[1]].imag_path]
          }).then(res => {
            reqD_detail.splice(idx[1] * 1,1)
            const tempReqD_detail = 'reqD_inform['+idx[0]+'].reqD_detail'
            that.setData({
              [tempReqD_detail]: reqD_detail,
           })
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
   * 获得初始表格数据
   */
  getInitialReqD_inform(){
    const formS_style = this.data.formStyle[0].formS_style
    let reqD_inform = this.data.reqD_inform
    for (const f of formS_style) {
      if(f.formS_type == '多选' || f.formS_type == '单选'){
        let reqD_detail=[] 
        for (const d of f.formS_detail) {
          reqD_detail = reqD_detail.concat({
            value:d,
            checked:false
          })
        }
        reqD_inform = reqD_inform.concat({
          reqD_type:f.formS_type,
          reqD_detail:reqD_detail
        })
      }else{
        reqD_inform = reqD_inform.concat({
          reqD_type:f.formS_type,
          reqD_detail:''
        })
      }
    }
    this.setData({
      reqD_inform:reqD_inform,
      bottom:''
    })
  },

  /**
   * 获取经纬度
   */
  getLocation(e){
    wx.showLoading({
      title: '定位中',
    })
    const number = e.currentTarget.dataset.idx
    const that =this
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy:true,
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.getAddress(number,latitude,longitude)
      },
      fail(error){
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '请打开位置授权，否则无法使用该功能。',
          success (res) {
            if (res.confirm) {
              wx.openSetting()
            }
          },
          fail(){
            wx.showToast({
              title: '获取失败',
              icon: 'error',
              duration: 2000
            })
          }
        })
      }
     })
  },

  /**
   * 手动选择地址
   */
  chooseLocation(e){
    wx.showLoading({
      title: '加载中',
    })
    const number = e.currentTarget.dataset.idx
    const that =this
    wx.chooseLocation({
      success(res){
        const latitude = res.latitude
        const longitude = res.longitude
        const address = res.address + res.name
        const reqD_detail = 'reqD_inform['+ number +'].reqD_detail'
        that.setData({
          [reqD_detail]:{
            latitude,
            longitude,
            address
          }
        })
        wx.hideLoading()
        if(address == ''){
          wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
           })
        }
      },
      fail(){
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '请打开位置授权，否则无法使用该功能。',
          success (res) {
            if (res.confirm) {
              wx.openSetting()
            }
          },
          fail(){
            wx.showToast({
              title: '获取失败',
              icon: 'error',
              duration: 2000
            })
          }
        })
      }
    })
  },

  /**
   * 获得地址
   */
  getAddress(number,latitude,longitude){
    const that =this
    const locationString = latitude + "," + longitude;
    wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      "key": "HP7BZ-XXTK2-L4UUT-CGENF-WFE2Q-67BEZ",
      "location": locationString
    },
    method: 'GET',
    success: function (r) {
      const address = r.data.result.address
      const reqD_detail = 'reqD_inform['+ number +'].reqD_detail'
        that.setData({
        [reqD_detail]:{
          latitude,
          longitude,
          address
        }
        })
      wx.hideLoading()
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
   * 获得表格数据
   */
  getReqD_inform(req_id){
    const that = this
    db.collection('requestDetail').where({
      req_id: req_id,
      reqD_delete: 0
    }).get().then(res => {
      that.setData({
        req_state:res.data[0].req_state,
        reqD_inform:res.data[0].reqD_inform,
        req_id:res.data[0].req_id,
        requestDetail_id:res.data[0]._id,
      })
      const state = res.data[0].req_state
      db.collection('formStyle').doc(res.data[0].formS_id).get({
        success: function(res) {
          const formStyle = 'formStyle[0]'
          that.setData({
            [formStyle]:res.data,
            invitation:res.data.invi_detail,
            bottom:''
          })
          if(state > 1){
            that.getRequest()
            that.setData({
              disable:true,
            })
          }else{
            that.getAnnouncement(res.data.invi_detail)
          }
        }
      })
    })
  },

  /**
   * 退出删除照片
   */
  afterDelete(){
    let images = []
    for (const r of this.data.reqD_inform) {
      if(r.reqD_type === '照片'){
        for (const d of r.reqD_detail) {
          images = images.concat(d.imag_path)
        }
      }
    }
    if(images !== []){
      wx.cloud.deleteFile({
        fileList: images
      }).then(res => {
        // console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    if(options.req_id == undefined){
      wx.setStorage({
        data: "add",
        key: 'add',
      })
      this.getFormStyle()
      this.getAnnouncement(this.data.invitation)
      this.getInvitation()
    }else{
      this.getReqD_inform(options.req_id)
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
    this.getImages()

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
    wx.removeStorageSync('idx')
    wx.removeStorageSync('images')
    wx.removeStorageSync('disable')
    if(this.data.req_state === 0){
      this.afterDelete()
    }
    
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