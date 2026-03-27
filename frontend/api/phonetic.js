// api/phonetic.js
import request from '../utils/request.js';

// 获取音素分类索引 [cite: 127]
export const getPhonetics = () => {
  return request('/phonetics', {
    method: 'GET'
  });
};

// 获取音位解剖详情 [cite: 129]
export const getPhoneticDetail = (id) => {
  return request(`/phonetics/${id}`, {
    method: 'GET'
  });
};