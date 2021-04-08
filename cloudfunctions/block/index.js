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
      await transaction.collection('inviUser').doc(event.inviU_id)
      .update({
        data: {
          inviU_block: event.inviU_block,
        },
        fail: function() {
          Res = false
        }
      })
      if(event.inviU_block == 1){
        await transaction.collection('user').doc(event.user_id)
        .update({
          data: {
            invi_detail: ''
          },
          fail: function() {
            Res = false
          }
        })
      }



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

