import { getQuestionDetail, verifyQuestion } from '../../api/question.js';

Page({
  data: {
    questionId: null,
    stem: '',
    answerList: [] 
  },

  onLoad(options) {
    // 严格依赖上一页传来的 id
    const id = options.id; 
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ questionId: id });
    this.fetchVerbDetail(id);
  },

  async fetchVerbDetail(id) {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await getQuestionDetail(id);
      
      if(res && res.type === 'conjugation' && res.answerJson) {
        const answerList = Object.keys(res.answerJson).map(key => {
          return { person: key, userInput: '', resultClass: '' };
        });
        
        const order = ['je', 'tu', 'il/elle', 'il', 'elle', 'nous', 'vous', 'ils/elles', 'ils', 'elles'];
        answerList.sort((a, b) => order.indexOf(a.person) - order.indexOf(b.person));

        this.setData({ stem: res.stem, answerList });
      } else {
        wx.showToast({ title: '非动词变位题，无法自测', icon: 'none' });
      }
    } catch(err) {
      console.error('获取变位题目失败', err);
      wx.showToast({ title: '获取数据失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onInput(e) {
    const index = e.currentTarget.dataset.index;
    const val = e.detail.value;
    const key = `answerList[${index}].userInput`;
    const classKey = `answerList[${index}].resultClass`;
    
    // 当用户修改输入时，清除原本的红绿颜色状态
    this.setData({ 
      [key]: val,
      [classKey]: '' 
    });
  },

  // 校验逻辑 [cite: 143]
  async submitTest() {
    wx.showLoading({ title: '校验中' });
    
    // 构造并发请求组：分别对每一个人称进行后端校验 [cite: 371]
    const promises = this.data.answerList.map((item, index) => {
      if (!item.userInput.trim()) {
        // 没填直接判错，避免发无效请求
        return Promise.resolve({ index, isCorrect: false });
      }
      return verifyQuestion({
        questionId: this.data.questionId,
        userInput: item.userInput.trim(),
        person: item.person
      }).then(res => {
        return { index, isCorrect: res.isCorrect }; // 后端返回的 isCorrect 字段 [cite: 383]
      }).catch(() => {
        return { index, isCorrect: false };
      });
    });

    try {
      const results = await Promise.all(promises);
      let allCorrect = true;
      
      // 根据校验结果赋予 "text-green" 或 "text-red" 类名
      results.forEach(r => {
        const classKey = `answerList[${r.index}].resultClass`;
        this.setData({ [classKey]: r.isCorrect ? 'text-green' : 'text-red' });
        if (!r.isCorrect) allCorrect = false;
      });
      
      wx.hideLoading();
      if (allCorrect) {
        wx.showToast({ title: '全部正确！', icon: 'success' });
      } else {
        wx.showToast({ title: '有错误，请检查标红项', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '校验请求出错', icon: 'none' });
    }
  }
});