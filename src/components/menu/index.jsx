import React, { useEffect, useState, Fragment } from "react";
import { createPortal } from 'react-dom';
import debounce from 'lodash.debounce';
import {
  Menu,
  Item,
  useContextMenu
} from "react-contexify";
import { useNavigate, useLocation } from 'react-router';
import { message, Modal } from 'antd';
import "react-contexify/dist/ReactContexify.css";
import './index.css';
import { contextHanleMenu, winContext, storage } from '../../../utils/renderer';
import SettingBackground from '../settingBackground';
import { ExclamationCircleFilled } from '@ant-design/icons'
const { confirm } = Modal;

const MENU_ID = "menu";

export default function App({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [menu, setMenu] = useState([]);
  const [bgVisible, setBgVisible] = useState(false);

  const resetMenu = async () => {
    const menu = [
      { id: 'fullScreen', title: '全屏' },
      { id: 'changeBg', title: '切换背景', isShow: !['/login'].includes(pathname) },
      { id: 'reload', title: '刷新' },
      { id: 'openTool', title: '打开控制台' },
      { id: 'loginOut', title: '退出登录', isShow: !['/login'].includes(pathname) },
      { id: 'exportData', title: '导出数据' },
    ].filter(item => item.isShow !== false);
    const isDevToolsOpened = await winContext({ key: 'isDevToolsOpened' });
    const isFullScreen = await winContext({ key: 'isFullScreen' });
    const isMinimized = await winContext({ key: 'isMinimized' });
    const isMaximized = await winContext({ key: 'isMaximized' });
    menu.forEach(item => {
      if (['fullScreen', 'notFullScreen'].includes(item.id)) {
        item.id = isFullScreen ? 'notFullScreen' : 'fullScreen';
        item.title = isFullScreen ? '退出全屏' : '全屏'
      }
      if (['openTool', 'closeTool'].includes(item.id)) {
        item.id = isDevToolsOpened ? 'closeTool' : 'openTool';
        item.title = isDevToolsOpened ? '关闭控制台' : '打开控制台'
      }
    })
    setMenu([...menu])
  }


  useEffect(() => {
    window.addEventListener('resize', debounce(() => {
      resetMenu()
    }, 500));
    resetMenu()
  }, [pathname]);

  const { show } = useContextMenu({
    id: MENU_ID
  });


  const exportData = (url) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data.zip');
    a.click()
  }

  const changeBg = () => {
    setBgVisible(true)
  }

  const loginOut = () => {
    confirm({
      title: '确定要退出吗?',
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await storage.removeItem('loginInfo')
        navigate('/login')
      },
      onCancel() { },
    });
  }

  const handleItemClick = async (data) => {
    const userInfo = await storage.getItem('loginInfo') || {};
    const { id } = data;
    const handleMap = {
      fullScreen: 'fullScreen',
      notFullScreen: 'notFullScreen',
      changeBg,
      reload: 'reload',
      openTool: 'openTool',
      closeTool: 'closeTool',
      loginOut,
      exportData: 'exportData'
    }

    if (handleMap[id]) {
      if (typeof handleMap[id] === 'string') {
        const cbMap = {
          exportData
        }
        const res = await contextHanleMenu({ key: id, username: userInfo.uid });
        if (cbMap[id]) {
          cbMap[id](res)
        }
      } else {
        handleMap[id]();
      }
    } else {

      message.warning('开发中')
    }
  }

  function displayMenu(e) {
    show({
      event: e,
    });
  }

  const bgCancel = () => {
    setBgVisible(false)
  }

  return (
    <Fragment>
      <div style={{ height: '100%', overflow: 'auto' }} onContextMenu={displayMenu}>
        {children}
      </div>
      {createPortal(<Menu id={MENU_ID} animation='slide' theme='dark'>
        {
          menu.map(item => <Item id={item.id} onClick={handleItemClick}>
            {item.title}
          </Item>)
        }
      </Menu>, document.getElementById(MENU_ID))}
      <Modal destroyOnClose footer={false} onCancel={bgCancel} width={800} open={bgVisible} title='设置背景图'>
        <SettingBackground onCancel={bgCancel} />
      </Modal>
    </Fragment>
  );
}