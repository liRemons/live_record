import React, { useState, useEffect } from "react";
import calendar from './calendar';
import { Button, Modal, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { arrGroup } from 'methods-r';
import style from './index.module.less';
import classNames from 'classnames';
import Terms from './component/terms';
import { SizeInput } from 'remons-components';
import { LeftOutlined, RightOutlined, SendOutlined } from '@ant-design/icons';

function View(props) {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [data, setData] = useState([]);
  const [activeDate, setActiveDate] = useState(null);
  const [jumpInfo, setJumpInfo] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setData([...getData(year, month)]);
    if (!activeDate) {
      setActiveDate(dayjs().format('YYYY-MM-DD'));
      props.onChange(dayjs().format('YYYY-MM-DD'))
    }
    setJumpInfo({ year, month, date: activeDate ? dayjs(activeDate).date() : dayjs().date() })
  }, []);

  const changeDate = ({
    newMonth,
    newYear,
    date = dayjs().year(newYear).month(newMonth - 1).date(1).format('YYYY-MM-DD')
  }) => {
    setMonth(newMonth);
    setYear(newYear);
    setActiveDate(date);
    setData([...getData(newYear, newMonth)]);
    setJumpInfo({ year: newYear, month: newMonth, date: dayjs(date).date() });
    props.onChange(date)
  }

  useEffect(() => {
    const { date } = props;
    if (date) {
      const newMonth = dayjs(date).month() + 1
      const newYear = dayjs(date).year();
      changeDate({ newMonth, newYear, date })
    }
  }, [props.date])

  const getData = (year = dayjs().year(), month = dayjs().month() + 1) => {
    const now = dayjs().year(year).month(month - 1);
    const nowMonthDay = now.daysInMonth(); // 当前月有多少天
    const nowMonth = now.month() + 1; // 当前月
    const nowMonthWeek = now.date(1).day(); // 当前月的 1 号是周几
    const nowYear = now.year(); // 当前年
    const nowDate = now.date(); // 当前日期
    let data = [];
    let int;
    if (nowMonthWeek) {
      int = parseInt((nowMonthDay + nowMonthWeek) / 7);
    } else {
      int = parseInt((nowMonthDay) / 7);
    }
    const mod = ((int + 1) * 7 - (nowMonthDay + nowMonthWeek)) % 7;
    data = Array(7 * (int + (mod ? 1 : 0))).fill().map(i => ({}))
    // nowMonthWeek + nowMonth
    const nowData = Array(nowMonthDay).fill().map((item, i) => calendar.solar2lunar(nowYear, nowMonth, now.date(i + 1).date()))
    data[nowMonthWeek] = {
      ...calendar.solar2lunar(nowYear, nowMonth, nowDate)
    }
    data.splice(nowMonthWeek, nowMonthDay, ...nowData);
    const lastData = Array(nowMonthWeek).fill().map((item, i) => {
      const firstMonthDate = now.startOf('month');
      const lastDate = firstMonthDate.subtract(i + 1, 'day');
      return {
        ...calendar.solar2lunar(lastDate.year(), lastDate.month() + 1, lastDate.date()),
        type: 'last'
      }
    }).reverse();
    data.splice(0, nowMonthWeek, ...lastData);
    const nextBeforeLength = nowMonthWeek + nowData.length;
    const nextData = Array(data.length - nextBeforeLength).fill().map((item, i) => {
      const endMonthDate = now.endOf('month');
      const nextDate = endMonthDate.add(i + 1, 'day');
      return {
        ...calendar.solar2lunar(nextDate.year(), nextDate.month() + 1, nextDate.date()),
        type: 'next'
      }
    })
    data.splice(nextBeforeLength, nextData.length, ...nextData)
    return data;
  }


  const handleLast = () => {
    const countMonth = ((month && year)) ? dayjs().year(year).month(month - 1).subtract(1, 'month') : dayjs().subtract(1, 'month');
    const newYear = countMonth.year();
    const newMonth = countMonth.month() + 1;
    changeDate({ newYear, newMonth })
  }

  const handleNext = () => {
    const countMonth = ((month && year)) ? dayjs().year(year).month(month - 1).add(1, 'month') : dayjs().add(1, 'month');
    const newYear = countMonth.year();
    const newMonth = countMonth.month() + 1;
    changeDate({ newYear, newMonth })
  }

  const handleDate = (el) => {
    const { cMonth: newMonth, cYear: newYear } = el;
    changeDate({ newYear, newMonth, date: el.date })
  };

  const getCNDate = () => {
    const date = dayjs(activeDate || dayjs());
    return calendar.solar2lunar(date.year(), date.month() + 1, date.date());
  }

  const toNow = () => {
    const newYear = dayjs().year();
    const newMonth = dayjs().month() + 1;
    changeDate({ newYear, newMonth, date: dayjs().format('YYYY-MM-DD') })
  }

  const changeJump = (val) => {
    const [year, month, date] = val;
    setJumpInfo({
      year,
      month,
      date
    })
  }

  const compareNow = dayjs(activeDate).diff(dayjs().format('YYYY-MM-DD'), 'day');
  return <div className={style.container}>
    <div className={style.nowInfo}>
      <div className={classNames(style.date)}>
        <Button shape="circle" onClick={handleLast}>
          <LeftOutlined />
        </Button>
        <div className={style.title}>
          <div className={style.card}>
            <span className={style.week}>{getCNDate().ncWeek}</span>
            <br />
            <span className={style.day}>{getCNDate().cDay < 10 ? `0${getCNDate().cDay}` : getCNDate().cDay}</span>
          </div>
          <span className={style.titleMain}>
            <span>{year} 年 {month < 10 ? `0${month}` : month} 月</span>
            <span className={style.before}>
              {
                compareNow ? `${Math.abs(compareNow)}天${compareNow > 0 ? '后' : '前'}` : null
              }
            </span>
          </span>
          {getCNDate().IDayCn ? <div className={style.card}>
            <span className={style.week}>{getCNDate().IMonthCn}</span>
            <br />
            <span className={classNames(style.day, style.cnDay)}>{getCNDate().IDayCn}</span>
          </div> : <div />}
        </div>
        <Button shape="circle" onClick={handleNext}>
          <RightOutlined />
        </Button>
      </div>
    </div>
    <div className={style.row}>
      {
        ['日', '一', '二', '三', '四', '五', '六'].map(item => <div className={style.week}>{item}</div>)
      }
    </div>
    {
      arrGroup(data, 7).map(item => <div className={style.row}>
        {
          item.map(el => {
            const nowDate = !dayjs(dayjs().format('YYYY-MM-DD')).diff(el.date, 'day');
            const active = activeDate && !dayjs(dayjs(activeDate).format('YYYY-MM-DD')).diff(el.date, 'day');
            return <div className={classNames(style.day, el.type, nowDate && 'nowDate', active && 'active')} onClick={() => handleDate(el)}>
              <span>
                {el.cDay}
                <br />
                <span className={classNames(style.IDayCn, props?.dates?.includes(`${dayjs(el.date).valueOf()}`) && style.mark, (el.Term && !el.type) && style.term)}>
                  {
                    el.Term ? el.Term : (el.lDay === 1 ? el.IMonthCn : el.IDayCn)
                  }
                </span>
              </span>
            </div>
          })
        }
      </div>)
    }
    <Terms term={getCNDate().Term} />
    <div className={style.handle}>
      {compareNow ? <Button size="large" type="primary" shape="circle" onClick={toNow}>今</Button> : null}
      <Button size="large" type="primary" shape="circle" onClick={() => setVisible(true)}><SendOutlined /></Button>
    </div>
    <Modal open={visible} title='日期跳转' onCancel={() => setVisible(false)} onOk={() => {
      const newYear = jumpInfo.year;
      const newMonth = jumpInfo.month;
      const newDate = jumpInfo.date;
      setVisible(false);
      changeDate({ newMonth, newYear, date: dayjs().year(newYear).month(newMonth - 1).date(newDate).format('YYYY-MM-DD') })
    }}>
      <SizeInput
        onChange={changeJump}
        value={[
          jumpInfo.year,
          jumpInfo.month,
          jumpInfo.date
        ]}
        unit={['年', '月', '日']}
        placeholder={['年', '月', '日']}
        numberInputProps={[
          { min: 0, step: 1 },
          { min: 1, step: 1, max: 12 },
          { min: 1, step: 1, max: 31 },
        ]} />
    </Modal>
  </div>
}
export default View;
