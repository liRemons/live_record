import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.css';
import Menu from './components/menu';
import FixedButton from './components/fixedButton';
import { useNavigate, useLocation } from 'react-router';
import config from '../electron.config.json';
import { recordRendJson, storage, recordGetFilePath } from '../utils/renderer';
import { parseContext } from '../utils';
import Router from './router';
import Header from './components/header';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});

  const settingBackground = async (userInfo) => {
    const res = await recordRendJson({
      uploadPath: parseContext(config.config_background_path, {
        username: userInfo.uid
      })
    });
    const info = (res?.fileList || []).find(el => el.uid === res.uid) || {};
    const url = await recordGetFilePath(info.url)
    document.documentElement.style.setProperty(
      "--bg",
      `url(${url})`
    );
  };

  const getUserInfo = async () => {
    const userInfo = await storage.getItem('loginInfo') || {};
    setUserInfo(userInfo);
    settingBackground(userInfo);
    return userInfo;
  }

  useEffect(() => {
    getUserInfo();
  }, [location.pathname])



  useEffect(async () => {
    // 判断登录态
    const userInfo = await getUserInfo()
    if (!userInfo.uid) {
      navigate('/login');
    } else {
      navigate(location.pathname || '/');
    };
  }, []);

  const whitePath = ['/login'];

  return <Menu>
    <ConfigProvider locale={locale} getPopupContainer={() => document.getElementById('container')}>
      <div className='app_container'>
        {!whitePath.includes(location.pathname) && <Header info={userInfo} className="header" />}
        <div className="main">
          <Router />
        </div>
      </div>
      <FixedButton />
    </ConfigProvider>
  </Menu>
}

export default App;