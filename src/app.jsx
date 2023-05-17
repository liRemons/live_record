import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Menu from './components/menu';
import Record from './pages/record';
import config from '../electron.config.json';
import { recordRendJson } from '../utils/renderer';
import { parseContext, encodeURL } from '../utils';

function App() {
  const settingBackground = () => {
    recordRendJson({ uploadPath: parseContext(config.config_background_path, { username: 'admin' }) }).then(res => {
      if (res) {
        const info = (res.fileList || []).find(el => el.uid === res.uid);
        if (info) {
          document.documentElement.style.setProperty(
            "--bg",
            `url(${encodeURL(`file://${info.url}`)})`
          );
        }
      }
    });
  };


  useEffect(() => {
    settingBackground()
  }, [])

  return <Menu>
    <ConfigProvider locale={locale}>
      <Record />
    </ConfigProvider>
  </Menu>
}

export default App;