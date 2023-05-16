import React from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Menu from './components/menu';
import Record from './pages/record'

function App() {
 

  return <Menu>
    <ConfigProvider locale={locale}>
      <Record />
    </ConfigProvider>
  </Menu>
}

export default App;