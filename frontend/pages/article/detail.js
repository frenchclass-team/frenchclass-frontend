import { getArticleDetail } from '../../api/article.js';

Page({
  data: {
    detail: {},
    currentTab: 0, // 0: 原文, 1: 学习, 2: 测试
    studyTab: 0,   // 0: 单词, 1: 语法
    showTranslation: false, // 控制原文翻译
    showAnswers: false,     // 控制测验答案
    userAnswers: {}         // 存储测验用户输入 { questionId: 'A' }
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchDetail(id);
    }
  },

  async fetchDetail(id) {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await getArticleDetail(id);
      
      // 1. 处理语法高亮：使用正则替换生成富文本字符串
      if (res.studyContent && res.studyContent.grammar) {
        res.studyContent.grammar = res.studyContent.grammar.map(g => {
          let text = g.contentBody || '';
          if (g.highlightKeywords && g.highlightKeywords.length > 0) {
            g.highlightKeywords.forEach(kw => {
              // 全局忽略大小写替换，包装高亮 class
              const regex = new RegExp(`(${kw})`, 'gi');
              text = text.replace(regex, '<span class="text-highlight">$1</span>');
            });
          }
          return { ...g, richText: text };
        });
      }

      // 2. 处理测验答案格式：统一提取 correct 字段供 WXML 比对
      if (res.quizzes) {
        res.quizzes = res.quizzes.map(q => {
          let correctStr = '';
          if (q.answer) {
            if (q.answer.correct) {
              correctStr = q.answer.correct;
            } else {
              correctStr = Object.values(q.answer).join(', ');
            }
          }
          
          // 【Bug 1 修复】预处理选择题选项，直接使用完整字符串作为 key
          let optionsList = [];
          if (q.type === 'choice' && q.options) {
            optionsList = q.options.map(opt => ({
              key: opt, // <-- 这里修改：直接使用 opt 本身作为判断和绑定的值
              text: opt
            }));
          }

          // 【Bug 2 修复】预处理变位题答案，生成人称排序数组
          let answerList = [];
          if (q.type === 'conjugation' && q.answer) {
            answerList = Object.keys(q.answer).map(key => ({
              person: key,
              correctVerb: q.answer[key]
            }));
            const order = ['je', 'tu', 'il/elle', 'il', 'elle', 'nous', 'vous', 'ils/elles', 'ils', 'elles'];
            answerList.sort((a, b) => order.indexOf(a.person) - order.indexOf(b.person));
          }

          // 将 optionsList 和 answerList 一起注入返回
          return { ...q, correctStr, optionsList, answerList };
        });
      }

      this.setData({ detail: res });
    } catch (err) {
      console.error('获取文章详情失败', err);
      wx.showToast({ title: '获取数据失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 切换主级 Tab
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
  },

  // 切换学习二级 Tab
  switchStudyTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ studyTab: index });
  },

  
  // 切换原文翻译显隐
  toggleTranslation() {
    this.setData({ showTranslation: !this.data.showTranslation });
  },

  // 捕获视频播放错误
  onVideoError(e) {
    const errMsg = e.detail.errMsg || '';
    
    // 静默忽略开发者工具内部自带的无害报错
    if (errMsg.includes('devtools_no_referrer')) {
       return; 
    }
    
    // 真实的真机播放错误才进行提示
    console.warn('视频加载异常:', errMsg);
    wx.showToast({
      title: '视频缓冲失败，请检查网络',
      icon: 'none'
    });
  },

  // 收集用户测验答案
  onQuizInput(e) {
    const id = e.currentTarget.dataset.id;
    const val = e.detail.value;
    this.setData({
      [`userAnswers.${id}`]: val
    });
  },

  // 显示测验答案
  toggleAnswers() {
    this.setData({ showAnswers: true });
    // 可以加一个全局提示
    wx.showToast({ title: '批改完成', icon: 'success' });
  }
});