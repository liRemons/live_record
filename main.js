/*
 * @Author: liRemons remons@foxmail.com
 * @Date: 2023-04-14 21:10:50
 * @LastEditors: liRemons remons@foxmail.com
 * @LastEditTime: 2023-04-27 19:55:20
 * @FilePath: \project\electron_test\mian.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const path = require('path');
const {
  recordUpload,
  recordGetDates,
  recordRemoveSync,
  recordWriteJson,
  recordRendJson,
  contextHanleMenu,
  winContext,
} = require('./utils/main');
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');

let mainWindow;

const createWindow = () => {
  // 创建浏览窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // 加载 index.html
  mainWindow.loadURL('http://localhost:8080/');
  // mainWindow.loadFile('dist/index.html');

  mainWindow.on('ready-to-show', function () {
    mainWindow.show();
    mainWindow.focus();
  });

  // 打开开发工具
  // mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+F12', () => {
    mainWindow.webContents.openDevTools();
  });
  globalShortcut.register('CommandOrControl+F5', () => {
    mainWindow.webContents.reload();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const handles = [
    { key: 'recordUpload', cb: recordUpload },
    { key: 'recordGetDates', cb: recordGetDates },
    { key: 'recordRemoveSync', cb: recordRemoveSync },
    { key: 'recordWriteJson', cb: recordWriteJson },
    { key: 'recordRendJson', cb: recordRendJson },
    { key: 'contextHanleMenu', cb: (e, { key }) => contextHanleMenu({ key, mainWindow }) },
    { key: 'winContext', cb: (e, { key }) => winContext({ key, mainWindow }) },
  ]

  handles.forEach(item => {
    ipcMain.handle(item.key, item.cb);
  })
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
