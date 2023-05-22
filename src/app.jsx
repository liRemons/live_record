import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less';
import Menu from './components/menu';
import { useNavigate } from 'react-router';
import config from '../electron.config.json';
import { recordRendJson } from '../utils/renderer';
import { parseContext } from '../utils';
import Router from './router';

function App() {
  const navigate = useNavigate();
  const settingBackground = async () => {
    const res = await recordRendJson({
      uploadPath: parseContext(config.config_background_path, {
        username: 'admin'
      })
    });
    if (res) {
      const info = (res.fileList || []).find(el => el.uid === res.uid);
      if (info) {
        document.documentElement.style.setProperty(
          "--bg",
          `url(${info.url})`
        );
      }
    }
  };


  useEffect(() => {
    settingBackground();
    // 判断登录态
    const loginInfo = null;
    if (!loginInfo) {
      navigate('/record');
    };
  }, []);

  return <Menu>
    <ConfigProvider locale={locale}>
      <Router />
    </ConfigProvider>
  </Menu>
}

export default App;