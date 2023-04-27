import React, { useEffect, useState } from "react";
import debounce from 'lodash.debounce'
import {
  Menu,
  Item,
  useContextMenu
} from "react-contexify";
import { message } from 'antd';
import "react-contexify/dist/ReactContexify.css";
import { contextHanleMenu, winContext } from '../../../utils/renderer';

const MENU_ID = "menu-id";

export default function App({ children }) {
  const [menu, setMenu] = useState([
    { id: 'fullScreen', title: '全屏' },
    { id: 'changeBg', title: '切换背景' },
    { id: 'reload', title: '刷新' },
    { id: 'openTool', title: '打开控制台' },
    { id: 'changeUser', title: '切换用户' },
  ]);

  const resetMenu = async () => {
    const isDevToolsOpened = await winContext({ key: 'isDevToolsOpened' });
    const isFullScreen = await winContext({ key: 'isFullScreen' });
    const isMinimized = await winContext({ key: 'isMinimized' });
    const isMaximized = await winContext({ key: 'isMaximized' });
    console.log('====================================');
    console.log(isFullScreen);
    console.log('====================================');
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
  }, []);

  const { show } = useContextMenu({
    id: MENU_ID
  });

  function handleItemClick(data) {
    const { id } = data;
    const handleMap = {
      fullScreen: 'fullScreen',
      notFullScreen: 'notFullScreen',
      changeBg: '',
      reload: 'reload',
      openTool: 'openTool',
      closeTool: 'closeTool',
      changeUser: ''
    }

    if (handleMap[id]) {
      if (typeof handleMap[id] === 'string') {
        contextHanleMenu({ key: id })
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

  return (
    <div>
      <div onContextMenu={displayMenu}>
        {children}
      </div>
      <Menu id={MENU_ID} animation='flip' theme='dark'>
        {
          menu.map(item => <Item id={item.id} onClick={handleItemClick}>
            {item.title}
          </Item>)
        }
      </Menu>
    </div>
  );
}