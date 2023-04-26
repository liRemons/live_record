import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './index.less'
import Calendar from './components/calendar';
import TimeLine from './components/timeLine';

function App() {
  const [date, setDate] = useState(null);
  const [dates, setDates] = useState([]);

  const changeDate = (date) => {
    setDate(date)
  }

  return <>
    <ConfigProvider locale={locale}>
      <Calendar dates={dates} date={date} onChange={changeDate} />
      <TimeLine changeDates={setDates} changeDate={changeDate} date={date} />
    </ConfigProvider>
  </>
}

export default App;