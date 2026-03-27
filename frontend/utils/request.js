// Base URL 约定
const BASE_URL = 'http://82.156.188.13:8080/api/v1'; // 请在部署时替换为实际 IP

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    // 获取本地存储的 token 作为身份凭证
    const token = wx.getStorageSync('token'); 
    
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };

    // 请求头需携带 Authorization 进行身份验证
    if (token) {
      header['Authorization'] = token; 
    }

    wx.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      header: header,
      success: (res) => {
        const data = res.data;
        // "SUCCESS" 表示成功
        if (data.code === 'SUCCESS') {
          resolve(data.data); // 直接返回具体业务数据
        } else if (data.code === 'UNAUTHORIZED') {
          // 未登录或 Token 失效，前端应跳转至登录页
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/auth/login'
          });
          reject(new Error(data.msg || '未登录或登录已过期'));
        } else {
          // 处理其他错误码 (如 NOT_FOUND, ROLE_REQUIRED, ERROR)
          wx.showToast({
            title: data.msg || '请求失败',
            icon: 'none'
          });
          reject(new Error(data.msg || '请求错误'));
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接异常',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

export default request;