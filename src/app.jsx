import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.css';
import Menu from './components/menu';
import { useNavigate, useLocation } from 'react-router';
import config from '../electron.config.json';
import { recordRendJson, storage, recordGetFilePath } from '../utils/renderer';
import { parseContext } from '../utils';
import Router from './router';
import Header from './components/header';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const settingBackground = async () => {
    // const username = await storage.getItem('loginInfo')
    const res = await recordRendJson({
      uploadPath: parseContext(config.config_background_path, {
        username: 'admin'
      })
    });
    if (res) {
      const info = (res.fileList || []).find(el => el.uid === res.uid);
      if (info) {
        const url = await recordGetFilePath(info.url)
        document.documentElement.style.setProperty(
          "--bg",
          `url(${url})`
        );
      }
    }
  };


  useEffect(async () => {
    settingBackground();
    // 判断登录态
    const loginInfo = await storage.getItem('loginInfo');
    setUserInfo(loginInfo);
    if (!loginInfo) {
      navigate('/login');
    } else {
      navigate('/');
    };
  }, []);

  const whitePath = ['/login']

  return <Menu>
    <ConfigProvider locale={locale} getPopupContainer={() => document.getElementById('container')}>
      <div className='app_container'>
        {!whitePath.includes(location.pathname) && <Header info={userInfo} className="header" />}
        <div className="main">
          <Router />
        </div>
      </div>
    </ConfigProvider>
  </Menu>
}

export default App;