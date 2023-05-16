import React, { useState } from "react";
import Calendar from '../../components/calendar';
import TimeLine from '../../components/timeLine';
import style from './index.module.less';

function View() {
  const [date, setDate] = useState(null);
  const [dates, setDates] = useState([]);

  const changeDate = (date) => {
    setDate(date)
  }
  return <>
    <div className={style.container}>
      <Calendar dates={dates} date={date} onChange={changeDate} />
      <TimeLine changeDates={setDates} changeDate={changeDate} date={date} />
    </div>
  </>
}

export default View;