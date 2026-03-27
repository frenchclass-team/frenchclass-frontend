// api/word.js
import request from '../utils/request.js';

// 获取单词分页列表 [cite: 208, 209, 210]
export const getWords = (page = 1, pageSize = 20) => {
  return request(`/content/words?page=${page}&page_size=${pageSize}`, {
    method: 'GET'
  });
};

// 标记单词掌握状态 [cite: 237, 238, 240]
export const markWordMastery = (id, status) => {
  return request(`/content/words/${id}/mastery?status=${status}`, {
    method: 'POST'
  });
};