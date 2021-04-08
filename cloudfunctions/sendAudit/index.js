// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hanbiao-1gw0ey627f4805b5',
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  const req_id = event.req_id
  const req_state = event.req_state == 4 ? '通过':'驳回'
  const req_title = event.req_title
  const req_time = event.req_time
  const req_reply = event.req_reply ||'无'
  let user_id
  let invi_detail
  let OPENID
  try {
    await db.collection('request').doc(req_id).get().then(res => {
      if(res.data != ''){
        user_id = res.data.user_id
        invi_detail = '涵码('+ res.data.invi_detail +')' 
      }
      })
    await db.collection('user').doc(user_id).get().then(res => {
      if(res.data != ''){
        OPENID = res.data.user_id
      }
      })
    const result = await cloud.openapi.subscribeMessage.send({
        touser: OPENID,
        page: 'pages/bind/bind',
        lang: 'zh_CN',
        data: {
          phrase5: {
            value: req_state
          },
          thing9: {
            value: req_title
          },
          date7: {
            value: req_time
          },
          thing8: {
            value: req_reply
          },
          thing11: {
            value: invi_detail
          }
        },
        templateId: 'GvE7iYbGFI7eymCymjd6h5NNyn7z3TCpMByn5UnrBVc',
      })
    return result
  } catch (err) {
    return err
  }
}
