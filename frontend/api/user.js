import request from '../utils/request.js';

// 获取个人信息 [cite: 109]
export const getUserProfile = () => {
  return request('/users/profile', {
    method: 'GET'
  });
};