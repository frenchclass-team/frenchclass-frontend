import request from '../utils/request.js';

// 获取文章/视频分页列表
export const getArticles = (page = 1, pageSize = 20) => {
  return request(`/content/articles?page=${page}&page_size=${pageSize}`, {
    method: 'GET'
  });
};

// 获取文章详情 (包含原文、学习内容、测试题)
export const getArticleDetail = (id) => {
  return request(`/content/articles/${id}`, {
    method: 'GET'
  });
};