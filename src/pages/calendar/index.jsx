/*
 * @Author: liRemons remons@foxmail.com
 * @Date: 2023-04-13 21:38:51
 * @LastEditors: liRemons remons@foxmail.com
 * @LastEditTime: 2023-04-13 22:10:01
 * @FilePath: \project\live_record\src\pages\calendar\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from "react";
import calendar from './calendar';
import { Button, Modal, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { arrGroup } from 'methods-r';
import style from './index.module.less';
import classNames from 'classnames';
import { LeftOutlined, RightOutlined, SendOutlined } from '@ant-design/icons';
function View() {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [data, setData] = useState([]);
  const [activeDate, setActiveDate] = useState(null);
  const [jumpInfo, setJumpInfo] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setData([...getData(year, month)]);
    if (activeDate) {
      setActiveDate(dayjs().year(year).month(month - 1).date(1).format('YYYY-MM-DD'));
    } else {
      setActiveDate(dayjs().format('YYYY-MM-DD'));
    }
    setJumpInfo({ year, month })
  }, [year, month]);
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
    let countMonth = ((month && year)) ? dayjs().year(year).month(month - 1).subtract(1, 'month') : dayjs().subtract(1, 'month');
    setYear(countMonth.year());
    setMonth(countMonth.month() + 1)
  }
  const handleNext = () => {
    let countMonth = ((month && year)) ? dayjs().year(year).month(month - 1).add(1, 'month') : dayjs().add(1, 'month');
    setYear(countMonth.year());
    setMonth(countMonth.month() + 1)
  }
  const awaitUpdateActiveDate = (date) => {
    setTimeout(() => {
      setActiveDate(date)
    }, 0)
  }
  const handleDate = (el) => {
    if (el.type) {
      setMonth(el.cMonth);
      setYear(el.cYear)
    }
    awaitUpdateActiveDate(el.date)
  };
  const getCNDate = () => {
    const date = dayjs(activeDate || dayjs());
    return calendar.solar2lunar(date.year(), date.month() + 1, date.date());
  }
  const toNow = () => {
    setYear(dayjs().year());
    setMonth(dayjs().month() + 1);
    awaitUpdateActiveDate(dayjs().format('YYYY-MM-DD'));
  }
  const compareNow = dayjs(activeDate).diff(dayjs().format('YYYY-MM-DD'), 'day')

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
          <div className={style.card}>
            <span className={style.week}>{getCNDate().IMonthCn}</span>
            <br />
            <span className={classNames(style.day, style.cnDay)}>{getCNDate().IDayCn}</span>
          </div>
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
                <span className={classNames(style.IDayCn, (el.Term && !el.type) && style.term)}>
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
    <div className={style.handle}>
      {compareNow ? <Button size="large" type="primary" shape="circle" onClick={toNow}>今</Button> : null}
      <Button size="large" type="primary" shape="circle" onClick={() => setVisible(true)}><SendOutlined /></Button>
    </div>
    <Modal open={visible} title='日期跳转' onCancel={() => setVisible(false)} onOk={() => {
      setYear(jumpInfo.year);
      setMonth(jumpInfo.month);
      setVisible(false)
    }}>
      <InputNumber
        value={jumpInfo.year}
        onChange={(year) => setJumpInfo({
          year, month: jumpInfo.month
        })}
        min={1900}
        max={2100} /> 年
      <InputNumber
        value={jumpInfo.month}
        min={1}
        max={12}
        onChange={(month) => setJumpInfo({
          year: jumpInfo.year, month: month
        })}
      /> 月
    </Modal>
  </div>
}
export default View;