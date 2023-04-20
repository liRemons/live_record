import React from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Calendar from './components/calendar';
import Upload from './components/upload/index'
import Editor from './components/editor/index'

function App() {


  const changeDate = (date) => {
    console.log(date);
  }
  return <>
    <ConfigProvider locale={locale}>
      <Calendar onChange={changeDate} />
      <Upload />
      <Editor />
    </ConfigProvider>
  </>
}

export default App;