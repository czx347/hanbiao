// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  const invi_detail =event.invi_detail ||''
  const user_name =event.user_name ||''
  const inviU_delete =event.inviU_delete
  try {
    return await db.collection('inviUser')
    .aggregate()
    .match({
      invi_detail: invi_detail,
      inviU_delete: inviU_delete
    })
    .lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user',
    })
    .match({
      ['user.user_name']: {								
        $regex:'.*' + user_name + '.*',		
        $options: 'i'						
      },
    })
    .end()
  } catch (e) {
    console.error(e)
  }
 
}

