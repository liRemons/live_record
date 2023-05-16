const fs = require('fs');
const path = require('path');
const electronConfig = require('../electron.config.json');
const fsExtra = require('fs-extra');
const { parseContext } = require('./index.js');
const dayjs = require('dayjs');
const compressing = require('compressing');


const exportData = async () => {
  await fsExtra.copySync('electron.config.json', 'usr/admin/electron.config.json');
  await compressing.zip.compressDir(path.resolve(__dirname, '../usr'), `../data.zip`);
  return path.resolve(__dirname, 'data.zip');
}

const recordUpload = async (event, { path: filepath, name, uid, type, uploadPath }) => {
  const copyPath = path.resolve(__dirname, `../${uploadPath}${name}`)
  await fsExtra.copySync(filepath, copyPath);
  return {
    url: copyPath,
    status: 'done',
    name,
    uid,
    type
  }
}


const recordGetDates = async (e) => {
  const uploadPath = parseContext(electronConfig.upload_path, { username: 'admin', date: '/' });
  try {
    const res = await fs.readdirSync(path.resolve(__dirname, `../${uploadPath}`));
    const newPromise = (date) => {
      return new Promise(async (resolve) => {
        const flag = await fs.existsSync(path.resolve(__dirname, `../${uploadPath}${date}/data.json`));
        resolve({ date, flag })
      })
    }
    let all = res.map((date) => newPromise(date))
    const allRes = await Promise.all(all);
    return allRes.filter(item => item.flag).map(item => item.date)
  } catch (error) {
  }
}


const recordRemoveSync = async (e, { uploadPath }) => {
  await fsExtra.removeSync(path.resolve(__dirname, `../${uploadPath}`));
  return true;
}

const recordWriteJson = async (e, { uploadPath, data }) => {
  await fsExtra.outputJsonSync(path.resolve(__dirname, `../${uploadPath}data.json`), data);
  const rendData = fsExtra.readJsonSync(path.resolve(__dirname, `../${uploadPath}data.json`));
  return rendData;
}

const recordWriteConfig = async (e, { data }) => {
  await fsExtra.outputJsonSync(path.resolve(__dirname, '../electron.config.json'), data);
  const rendData = fsExtra.readJsonSync(path.resolve(__dirname, '../electron.config.json'));
  return rendData;
}

const recordRendJson = async (e, { uploadPath }) => {
  const rendData = await fsExtra.readJsonSync(path.resolve(__dirname, `../${uploadPath}data.json`));
  return rendData;
}

const contextHanleMenu = async ({ key, mainWindow }) => {
  const handleMap = {
    fullScreen: () => mainWindow.setFullScreen(true),
    notFullScreen: () => mainWindow.setFullScreen(false),
    reload: () => mainWindow.webContents.reload(),
    openTool: () => mainWindow.webContents.openDevTools(),
    closeTool: () => mainWindow.webContents.closeDevTools(),
    exportData
  }

  if (handleMap[key]) {
    return handleMap[key]()
  }
}

const winContext = ({ key, mainWindow }) => {
  return {
    // 控制台
    isDevToolsOpened: mainWindow.isDevToolsOpened(),
    // 全屏
    isFullScreen: mainWindow.isFullScreen(),
    // 最小化
    isMinimized: mainWindow.isMinimized(),
    // 最大化
    isMaximized: mainWindow.isMaximized()
  }[key]
}


module.exports = {
  recordUpload,
  recordGetDates,
  recordRemoveSync,
  recordWriteJson,
  recordRendJson,
  contextHanleMenu,
  winContext,
  recordWriteConfig
}