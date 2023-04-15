const setExternals = (isEnvProduction) => {
  return isEnvProduction ? {
    // electron: require('electron')
  } : {
    // fs: require('fs'),
    // path: require('path')
    // electron: require('electron')
  };
}

module.exports = {
  setExternals
}