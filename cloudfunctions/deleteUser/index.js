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
      await transaction.collection('user').doc(event.user.id).update({
        data: {
          invi_detail: event.user.invi_detail,
        },
        fail: function() {
          Res = false
        }
      })

      await transaction.collection('inviUser').where({
        invi_detail:event.inviUser.invi_detail,
        user_id:event.inviUser.user_id,
        }).update({
          data:{
            inviU_delete:event.inviUser.inviU_delete,
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

