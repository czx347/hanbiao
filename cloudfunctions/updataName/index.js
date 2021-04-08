// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event) => {
  const user_id =event.user_id
  const user_name =event.user_name
  const user_photo =event.user_photo
  try{
    if(user_name == ''){
      return await db.collection('user').doc(user_id).update({
        data: {
          user_photo: user_photo,
        }
      }).then(res =>{
        console.res
      })
    }else if(user_photo == ''){
      return await db.collection('user').doc(user_id).update({
        data: {
          user_name: user_name,
        }
      }).then(res =>{
        console.res
      })
    }else{
      return await db.collection('user').doc(user_id).update({
        data: {
          user_photo: user_photo,
          user_name: user_name,
        }
      }).then(res =>{
        console.res
      })
    }
  }catch(e){
    console.error(e)
  }
}

