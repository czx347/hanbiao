// components/window/window.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    display:''

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        display:'display: none'
      })
    }

  }
})
