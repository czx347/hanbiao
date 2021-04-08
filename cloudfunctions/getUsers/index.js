// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  const invi_detail =event.invi_detail
  const page =event.page - 1
  const number =event.number
  try {
    return await db.collection('inviUser')
    .aggregate()
    .match({
      invi_detail: invi_detail,
      inviU_delete: 0
    })
    .lookup({
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user',
    })
    .skip(page * number)
    .limit(number)
    .end()
  } catch (e) {
    console.error(e)
  }
 
}

