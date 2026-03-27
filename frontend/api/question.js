import request from '../utils/request.js';

// 获取单道题目详情（包含变位题数据） [cite: 326]
export const getQuestionDetail = (id) => {
  return request(`/content/questions/${id}`, {
    method: 'GET'
  });
};

// 获取动词变位题列表
export const getVerbList = () => {
  return request(`/content/questions/verbs`, {
    method: 'GET'
  });
};

// 题目自测校验 [cite: 371]
export const verifyQuestion = (data) => {
  return request(`/content/questions/verify`, {
    method: 'POST',
    data: data // 包含 questionId, userInput, person [cite: 376, 377, 378]
  });
};