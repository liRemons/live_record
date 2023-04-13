const setExternals = (isEnvProduction) => {
  return isEnvProduction ? {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    'antd/dist/antd.css': 'antd',
    mobx: 'mobx',
    'mobx-react': 'mobxReact',
    axios: 'axios',
    qs: 'Qs',
  } : {};
}

module.exports = {
  setExternals
}