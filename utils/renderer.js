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

export const recordGetDates = () => {
  return window.electronAPI.recordGetDates();
};