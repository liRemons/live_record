window.electronAPI.log && window.electronAPI.log((e,value) => {
  console.log(value)
})

export const uploadFile = (params) => {
  window.electronAPI.upload(params);
};
