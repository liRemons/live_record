window.electronAPI.log &&
  window.electronAPI.log((e, value) => {
    console.log(value);
  });

export const uploadFile = (params) => {
  return window.electronAPI.upload(params);
};
