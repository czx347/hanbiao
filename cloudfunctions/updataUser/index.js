// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  try{
    return await db.collection('user').doc(event.user_id).update({
      data: {
        invi_detail: event.invi_detail,
        user_admin: event.user_admin,
      }
    }).then(res =>{
      console.res
    })
  }catch(e){
    console.error(e)
  }
}

