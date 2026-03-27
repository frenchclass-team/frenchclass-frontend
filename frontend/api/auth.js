import request from '../utils/request.js';

// 登录接口 [cite: 106]
export const login = (data) => {
  return request('/auth/login', {
    method: 'POST',
    data: data // 包含 identifier, password, role [cite: 107]
  });
};