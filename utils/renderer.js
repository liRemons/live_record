window.electronAPI.log &&
  window.electronAPI.log((e, value) => {
    console.log(value);
  });

export const uploadFile = (params) => {
  return window.electronAPI.upload(params);
};

export const removeSync = (params) => {
  return window.electronAPI.removeSync(params);
}

export const writeJson = (params) => {
  return window.electronAPI.writeJson(params);
}

export const contextHanleMenu = (params) => {
  return window.electronAPI.contextHanleMenu(params);
}

export const winContext = (params) => {
  return window.electronAPI.winContext(params);
}

export const rendJson = (params) => {
  return window.electronAPI.rendJson(params);
}

export const getDates = () => {
  return window.electronAPI.getDates();
};