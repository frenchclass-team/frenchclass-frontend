import { getPhoneticDetail } from '../../api/phonetic.js';

// 获取全局录音管理器 (Recorder 是全局单例，放外面没问题)
const recorderManager = wx.getRecorderManager();

Page({
  data: {
    detail: {},
    isRecording: false,
    recordTempFilePath: '',
    isPlayingStandard: false,
    isPlayingRecord: false
  },

  onLoad(options) {
    // 【修复】在页面实例化时创建独立的音频上下文
    this.standardAudioCtx = wx.createInnerAudioContext();
    this.recordAudioCtx = wx.createInnerAudioContext();

    const id = options.id || '';
    if (id) {
      this.fetchDetail(id);
    }
    this.initAudioContexts();
  },

  onUnload() {
    // 【修复】页面卸载时销毁挂载在 this 上的实例
    if (this.standardAudioCtx) this.standardAudioCtx.destroy();
    if (this.recordAudioCtx) this.recordAudioCtx.destroy();
  },

  async fetchDetail(id) {
    try {
      const res = await getPhoneticDetail(id);
      this.setData({ detail: res });
      
      if (res.audioUrl) {
        this.standardAudioCtx.src = res.audioUrl;
      }
    } catch (err) {
      console.error('获取详情失败', err);
    }
  },

  initAudioContexts() {
    // 【修复】替换所有全局变量为 this.xxx
    this.standardAudioCtx.onPlay(() => this.setData({ isPlayingStandard: true }));
    this.standardAudioCtx.onEnded(() => this.setData({ isPlayingStandard: false }));
    this.standardAudioCtx.onError(() => this.setData({ isPlayingStandard: false }));

    this.recordAudioCtx.onPlay(() => this.setData({ isPlayingRecord: true }));
    this.recordAudioCtx.onEnded(() => this.setData({ isPlayingRecord: false }));
    this.recordAudioCtx.onError(() => this.setData({ isPlayingRecord: false }));

    recorderManager.onStart(() => {
      this.setData({ isRecording: true });
    });
    
    recorderManager.onStop((res) => {
      this.setData({ 
        isRecording: false, 
        recordTempFilePath: res.tempFilePath 
      });
      this.recordAudioCtx.src = res.tempFilePath;
    });

    recorderManager.onError((err) => {
      console.error('录音出错:', err);
      this.setData({ isRecording: false });
      wx.showToast({ title: '录音时间太短或发生错误', icon: 'none' });
    });
  },

  playStandardAudio() {
    if (this.data.isPlayingStandard) {
      this.standardAudioCtx.stop();
      this.setData({ isPlayingStandard: false });
    } else {
      this.recordAudioCtx.stop(); 
      this.standardAudioCtx.play();
    }
  },

  playRecordAudio() {
    if (!this.data.recordTempFilePath) {
      return wx.showToast({ title: '请先按住录音', icon: 'none' });
    }
    if (this.data.isPlayingRecord) {
      this.recordAudioCtx.stop();
      this.setData({ isPlayingRecord: false });
    } else {
      this.standardAudioCtx.stop(); 
      this.recordAudioCtx.play();
    }
  },

  startRecord() {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.standardAudioCtx.stop();
        this.recordAudioCtx.stop();
        recorderManager.start({ format: 'mp3' });
      },
      fail: () => {
        wx.showModal({
          title: '权限申请',
          content: '录音功能需要麦克风权限，请前往设置开启',
          success: (res) => {
             if (res.confirm) wx.openSetting();
          }
        });
      }
    });
  },

  stopRecord() {
    recorderManager.stop();
    this.setData({ isRecording: false }); 
  }
});