// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('user').add({
      data: {
        user_id:event.user_id,
        user_name:event.user_name,
        user_photo:event.user_photo,
        invi_detail:'',
        user_admin:event.user_admin,
        user_time:event.user_time,
        user_delete: event.user_delete
      }
    })
  }catch(e){
    console.error(e)
  }

}