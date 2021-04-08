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
      await transaction.collection('announcement').add({
        data: {
          invi_detail:event.invi_detail,
          anno_name:event.anno_name,
          anno_delete:event.anno_delete,
          anno_live:event.anno_live,
          anno_creator:event.anno_creator,
          anno_time:event.anno_time,
        },
        fail: function() {
          Res = false
        }
      })

      await transaction.collection('announcement').where({
        invi_detail:event.invi_detail
        }).update({
          data:{
            anno_live:0
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

