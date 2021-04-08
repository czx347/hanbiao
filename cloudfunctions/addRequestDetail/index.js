// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  let Res = true
  try {
    if(event.request._id == ''){                   // 增加
      await db.runTransaction(async transaction => {
        const req_id = await transaction.collection('request').add({
          data: {
            invi_detail: event.request.invi_detail,
            req_check: event.request.req_check,
            req_state: event.request.req_state,
            req_reply: event.request.req_reply,
            req_title: event.request.req_title,
            user_id: event.request.user_id,
            req_time: event.request.req_time,
            req_delete: event.request.req_delete,
          },
          fail: function() {
            Res = false
          }
        })

        await transaction.collection('requestDetail').add({
          data: {
            reqD_inform: event.requestDetail.reqD_inform,
            req_state	: event.requestDetail.req_state,
            formS_id: event.requestDetail.formS_id,
            req_id: req_id._id,
            reqD_delete: event.requestDetail.reqD_delete,
          },
          fail: function() {
            Res = false
          }
        })
  
  
        if (!Res) {
          await transaction.rollback(-100)
        } 
      })
    }else{                                              // 更新
      await db.runTransaction(async transaction => {
        await transaction.collection('request').doc(event.request._id).update({
          data: {
            req_title: event.request.req_title,
            req_time: event.request.req_time,
            req_state: event.request.req_state,
          },
          fail: function() {
            Res = false
          }
        })
        await transaction.collection('requestDetail').doc(event.requestDetail._id).update({
          data: {
            reqD_inform: event.requestDetail.reqD_inform,
            req_state	: event.requestDetail.req_state,
          },
          fail: function() {
            Res = false
          }
        })
  
  
        if (!Res) {
          await transaction.rollback(-100)
        } 
      })
  
    }
    return {
      success: true,
    }
  } catch (e) {
    console.error(`transaction error`, e)

    return {
      success: false,
      error: e
    }
  }
}

