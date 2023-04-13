import React from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import { observer } from 'mobx-react';
import Calendar from './pages/calendar'

function App() {
  return <>
    <ConfigProvider locale={locale}>
      <Calendar />
    </ConfigProvider>
  </>
}

export default observer(App);