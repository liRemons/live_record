import React, { useEffect, useState, Fragment, useRef } from "react";
import debounce from 'lodash.debounce';
import {
  Menu,
  Item,
  useContextMenu
} from "react-contexify";
import { message, Modal } from 'antd';
import "react-contexify/dist/ReactContexify.css";
import { contextHanleMenu, winContext } from '../../../utils/renderer';
import SettingBackground from '../settingBackground';

const MENU_ID = "menu";

export default function App({ children }) {
  const [menu, setMenu] = useState([
    { id: 'fullScreen', title: '全屏' },
    { id: 'changeBg', title: '切换背景' },
    { id: 'reload', title: '刷新' },
    { id: 'openTool', title: '打开控制台' },
    { id: 'changeUser', title: '切换用户' },
    { id: 'exportData', title: '导出数据' },
  ]);

  const [bgVisible, setBgVisible] = useState(false);

  const resetMenu = async () => {
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
  }, []);

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

  const handleItemClick = async (data) => {
    const { id } = data;
    const handleMap = {
      fullScreen: 'fullScreen',
      notFullScreen: 'notFullScreen',
      changeBg,
      reload: 'reload',
      openTool: 'openTool',
      closeTool: 'closeTool',
      changeUser: '',
      exportData: 'exportData'
    }

    if (handleMap[id]) {
      if (typeof handleMap[id] === 'string') {
        const cbMap = {
          exportData
        }
        const res = await contextHanleMenu({ key: id });
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
      <div style={{ height: '100%', overflow: 'auto'}} onContextMenu={displayMenu}>
        {children}
      </div>
      <Menu id={MENU_ID} animation='slide' theme='dark'>
        {
          menu.map(item => <Item id={item.id} onClick={handleItemClick}>
            {item.title}
          </Item>)
        }
      </Menu>
      <Modal destroyOnClose footer={false} onCancel={bgCancel} width={800} open={bgVisible} title='设置背景图'>
        <SettingBackground onCancel={bgCancel} />
      </Modal>
    </Fragment>
  );
}