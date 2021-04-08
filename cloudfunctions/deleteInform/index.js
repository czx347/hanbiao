// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  try{
    return await db.collection('announcement').doc(event.anno_id).update({
      data: {
        anno_live: event.anno_live,
        anno_delete: event.anno_delete,
      }
    }).then(res =>{
      console.res
    })
  }catch(e){
    console.error(e)
  }
}

