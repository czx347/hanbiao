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
    await db.runTransaction(async transaction => {
      await transaction.collection('request').doc(event.req_id).update({
        data: {
          req_state: event.req_state,
          req_time: event.req_time,
        },
        fail: function() {
          Res = false
        }
      })
      await transaction.collection('requestDetail').where({
        req_id: event.req_id
      })
      .update({
        data: {
          req_state	: event.req_state
        },
        fail: function() {
          Res = false
        }
      })



      if (!Res) {
        await transaction.rollback(-100)
      } 
    })


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

