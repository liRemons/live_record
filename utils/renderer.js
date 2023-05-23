
import config from '../electron.config.json'

window.electronAPI.log &&
  window.electronAPI.log((e, value) => {
    console.log(value);
  });

export const recordUploadFile = (params) => {
  return window.electronAPI.recordUpload(params);
};

export const recordRemoveSync = (params) => {
  return window.electronAPI.recordRemoveSync(params);
}

export const recordWriteJson = (params) => {
  return window.electronAPI.recordWriteJson(params);
}

export const contextHanleMenu = (params) => {
  return window.electronAPI.contextHanleMenu(params);
}

export const winContext = (params) => {
  return window.electronAPI.winContext(params);
}

export const recordRendJson = (params) => {
  return window.electronAPI.recordRendJson(params);
}

export const recordGetFilePath = (params) => {
  return window.electronAPI.recordGetFilePath(params);
}

export const recordGetDates = () => {
  return window.electronAPI.recordGetDates();
};

class Store {
  uploadPath = `${config.user_config}storage/`;

  async getItem(key) {
    const res = await recordRendJson({ uploadPath: this.uploadPath });
    return (res || {})?.[key]
  }
  async setItem(key, value) {
    const res = await recordRendJson({ uploadPath: this.uploadPath })
    recordWriteJson({ uploadPath: this.uploadPath, data: { ...(res || {}), [key]: value } })
  }
  async removeItem(key) {
    const res = await recordRendJson({ uploadPath: this.uploadPath })
    delete (res || {})?.[key]
    recordWriteJson({ uploadPath: this.uploadPath, data: (res || {}) })
  }
  removeAll() {
    recordWriteJson({ uploadPath: this.uploadPath, data: {} })
  }
}

export const storage = new Store


