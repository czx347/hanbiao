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
      await transaction.collection('formStyle').add({
        data: {
          invi_detail:event.invi_detail,
          formS_creator:event.formS_creator,
          formS_style:event.formS_style,
          formS_delete:event.formS_delete,
          formS_live:event.formS_live,
        },
        fail: function() {
          Res = false
        }
      })

      await transaction.collection('formStyle').where({
        invi_detail:event.invi_detail
        }).update({
          data:{
            formS_live:0
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

