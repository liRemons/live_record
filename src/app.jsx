import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Calendar from './components/calendar';
import TimeLine from './components/timeLine';
import Menu from './components/menu'

function App() {
  const [date, setDate] = useState(null);
  const [dates, setDates] = useState([]);

  const changeDate = (date) => {
    setDate(date)
  }

  return <Menu>
    <ConfigProvider locale={locale}>
      <Calendar dates={dates} date={date} onChange={changeDate} />
      <TimeLine changeDates={setDates} changeDate={changeDate} date={date} />
    </ConfigProvider>
  </Menu>
}

export default App;