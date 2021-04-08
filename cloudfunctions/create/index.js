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
    const result = await db.runTransaction(async transaction => {
      await transaction.collection('invitation').add({
        data: {
          invi_detail:event.invitation.invi_detail,
          invi_password:event.invitation.invi_password,
          invi_time:event.invitation.invi_time,
          invi_delete:event.invitation.invi_delete,
          user_id:event.invitation.user_id,
        },
        fail: function() {
          Res = false
        }
      })
        
      await transaction.collection('inviUser').add({
        data: {
          invi_detail: event.inviUser.invi_detail,
          user_id: event.inviUser.user_id,
          inviU_admin: event.inviUser.inviU_admin,
          inviU_block: event.inviUser.inviU_block,
          inviU_delete: event.inviUser.inviU_delete,
        },
        fail: function() {
          Res = false
        }
      })
      await transaction.collection('user').doc(event.user.user_id).update({
        data: {
          invi_detail: event.user.invi_detail,
          user_admin: event.user.user_admin,
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

