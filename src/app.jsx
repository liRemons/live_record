import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Calendar from './components/calendar';
import Upload from './components/upload/index';
import Editor from './components/editor/index';
import TimeLine from './components/timeLine';

function App() {
  const [date, setDate] = useState(null);

  const changeDate = (date) => {
    setDate(date)
  }
  return <>
    <ConfigProvider locale={locale}>
      <Calendar onChange={changeDate} />
      {/* <Upload date={date} />
      <Editor date={date} /> */}
      <TimeLine date={date} />
    </ConfigProvider>
  </>
}

export default App;