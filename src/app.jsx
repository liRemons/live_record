import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less';
import Menu from './components/menu';
import { useNavigate, useLocation } from 'react-router';
import config from '../electron.config.json';
import { recordRendJson, storage } from '../utils/renderer';
import { parseContext } from '../utils';
import Router from './router';
import Header from './components/header';

function App() {
  const navigate = useNavigate();
  const location = useLocation()
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


  useEffect(async() => {
    settingBackground();
    // 判断登录态
    const loginInfo = await storage.getItem('loginInfo');
    if (!loginInfo) {
      navigate('/login');
    };
  }, []);

  const whitePath = ['/login', '/']

  return <Menu>
    <ConfigProvider locale={locale}>
     {!whitePath.includes(location.pathname) && <Header />}
      <Router />
    </ConfigProvider>
  </Menu>
}

export default App;