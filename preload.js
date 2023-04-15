const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})

contextBridge.exposeInMainWorld('electronAPI', {
  upload: (data) => ipcRenderer.invoke('upload', data),
  log: (callback) => ipcRenderer.on('log', callback)
})