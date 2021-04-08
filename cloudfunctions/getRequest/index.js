// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event) => {
  const invi_detail =event.invi_detail || ''
  const req_delete =event.req_delete
  const currentTab =event.currentTab
  const user_admin =event.user_admin
  const user_id =event.user_id || ''
  const page =event.page - 1
  const number =event.number
  if(user_admin == 0){                       // 用户
    if(currentTab == 2){                      // 未审核
      try {
        return await db.collection('request')
        .aggregate()
        .match({
          user_id: user_id,
          req_state: _.lte(2),
          req_delete: req_delete
        })
        .sort({
          req_state: 1,
          req_time: -1,
        })
        .skip(page * number)
        .limit(number)
        .end()
      } catch (e) {
        console.error(e)
      }

    }else{                                                      // 已审核
      try {
        return await db.collection('request')
        .aggregate()
        .match({
          user_id: user_id,
          req_state:_.gte(3),
          req_delete: req_delete
        })
        .sort({
          req_time: -1,
        })
        .skip(page * number)
        .limit(number)
        .end()
      } catch (e) {
        console.error(e)
      }

    }

  }else{                                                  // 管理员
    if(currentTab == 2){                                     // 未审核
      try {
        return await db.collection('request')
        .aggregate()
        .match({
          invi_detail: invi_detail,
          req_state: 2,
          req_delete: req_delete
        })
        .sort({
          req_time: -1,
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

    }else{                                                      // 已审核
      try {
        return await db.collection('request')
        .aggregate()
        .match({
          invi_detail: invi_detail,
          req_state:_.gte(3),
          req_delete: req_delete
        })
        .lookup({
          from: 'user',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        })
        .sort({
          req_time: -1,
        })
        .skip(page * number)
        .limit(number)
        .end()
      } catch (e) {
        console.error(e)
      }
      
    }

  }
 
}

