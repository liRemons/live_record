const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})

contextBridge.exposeInMainWorld('electronAPI', {
  recordUpload: (data) => ipcRenderer.invoke('recordUpload', data),
  contextHanleMenu: (data) => ipcRenderer.invoke('contextHanleMenu', data),
  recordGetDates: (data) => ipcRenderer.invoke('recordGetDates', data),
  recordRemoveSync: (data) => ipcRenderer.invoke('recordRemoveSync', data),
  recordWriteJson: (data) => ipcRenderer.invoke('recordWriteJson', data),
  recordRendJson: (data) => ipcRenderer.invoke('recordRendJson', data),
  winContext: (data) => ipcRenderer.invoke('winContext', data),
  log: (callback) => ipcRenderer.on('log', callback),
})