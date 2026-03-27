import { markWordMastery, getWords } from '../../api/word.js';

// 移除全局：const audioCtx = wx.createInnerAudioContext();

Page({
  data: {
    wordList: [],
    currentIndex: 0,
    step: 0 // 控制渐进式显影：0=初始态，1=显释义，2=显例句 [cite: 118]
  },
  
  onLoad(options) {
    this.audioCtx = wx.createInnerAudioContext();
    
    const index = parseInt(options.index || 0);
    // 从全局拉取单词列表，支持从列表页跳转过来时无缝滑动
    const globalList = getApp().globalData.currentWordList;
    
    if (globalList && globalList.length > 0) {
      this.setData({ wordList: globalList, currentIndex: index });
    } else {
      // 若直接进入（比如首页点击快速开始），则请求一批词
      this.fetchRandomWords();
    }
  },

  onUnload() {
    //audioCtx.destroy(); // 退出时销毁音频实例释放内存
    if (this.audioCtx) this.audioCtx.destroy(); 
  },

  async fetchRandomWords() {
    try {
      const res = await getWords(1, 10);
      this.setData({ wordList: res.items || [], currentIndex: 0 });
    } catch (err) {
      console.error('获取随机单词失败', err);
    }
  },

  // 渐进式点击显影控制
  handleTapBlank() {
    if (this.data.step < 2) {
      this.setData({ step: this.data.step + 1 });
    }
  },

  // 左右划动手势监听
  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current,
      step: 0 // 划动到新单词时，状态归零
    });
  },

  // 播放音频（单词与例句通用）
  playAudio(e) {
    const url = e.currentTarget.dataset.url; // 获取 OSS 地址 [cite: 219, 228]
    if (url) {
      //audioCtx.src = url;
      //audioCtx.play();
      this.audioCtx.src = url;
      this.audioCtx.play();
    } else {
      wx.showToast({ title: '暂无音频', icon: 'none' });
    }
  },

  // 处理掌握与未掌握标记逻辑
  async handleMastery(e) {
    const statusStr = e.currentTarget.dataset.status;
    const status = statusStr === 'true'; // 转换为布尔值 [cite: 240]
    const currentWord = this.data.wordList[this.data.currentIndex];
    
    if (!currentWord) return;

    try {
      // 提交到后端修改状态 [cite: 119, 238]
      await markWordMastery(currentWord.wordId, status);
      wx.showToast({ title: status ? '已掌握' : '未掌握', icon: 'success' });
      
      // 延时自动切换至下一个单词
      if (this.data.currentIndex < this.data.wordList.length - 1) {
        setTimeout(() => {
          this.setData({ 
            currentIndex: this.data.currentIndex + 1,
            step: 0
          });
        }, 600);
      } else {
        setTimeout(() => {
          wx.showToast({ title: '恭喜！本组单词已背完', icon: 'none' });
        }, 600);
      }
    } catch (err) {
      console.error('标记掌握状态失败', err);
    }
  }
});