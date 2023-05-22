import React from "react";
import style from './index.module.less';

const termsMap = {
  '立春': {
    key: 'theBeginningOfSpring',
    content: '阳和启蛰，品物皆春',
  },
  '雨水': {
    key: 'rainWater',
    content: '立春天渐暖，雨水送肥忙',
  },
  '惊蛰': {
    key: 'theWakingOfInsects',
    content: '惊蛰一犁地，春分地气通',
  },
  '春分': {
    key: 'theSpringEquinox',
    content: '春分有雨是丰年',
  },
  '清明': {
    key: 'pureBrightness',
    content: '清明有雨麦田肥，谷雨有雨好种棉',
  },
  '谷雨': {
    key: 'grainRain',
    content: '谷雨前后，种瓜种豆',
  },
  '立夏': {
    key: 'theBeginningOfSummer',
    content: '立夏不热，五谷不接',
  },
  '小满': {
    key: 'theBeginningOfSummer',
    content: '小满十日遍地黄',
  },
  '芒种': {
    key: 'grainInBeard',
    content: '芒种火烧天，夏至雨涟涟',
  },
  '夏至': {
    key: 'theSummerSolstice',
    content: '夏至一场雨，一滴值千金',
  },
  '小暑': {
    key: 'lesserHeat',
    content: '小暑过，一日热三分',
  },
  '大暑': {
    key: 'greaterHeat',
    content: '大暑小暑，淹死老鼠',
  },
  '立秋': {
    key: 'theBeginningOfAutumn',
    content: '立秋下雨，百日无霜',
  },
  '处暑': {
    key: 'theEndOfHeat',
    content: '处暑雨，粒粒皆米稻',
  },
  '白露': {
    key: 'whiteDew',
    content: '白露秋分夜，一夜凉一夜',
  },
  '秋分': {
    key: 'theAutumnEquinox',
    content: '秋风稻见黄，大风要提防',
  },
  '寒露': {
    key: 'coldDew',
    content: '寒露收山楂，霜降刨地瓜',
  },
  '霜降': {
    key: 'frostsDescent',
    content: '霜降播种，立冬见苗',
  },
  '立冬': {
    key: 'theBeginningOfWinter',
    content: '立冬北风冰雪多，立冬南风无雨雪',
  },
  '小雪': {
    key: 'lesserSnow',
    content: '小雪大雪不见雪，小麦大麦粒要瘪',
  },
  '大雪': {
    key: 'greaterSnow',
    content: '大雪到来大雪飘，兆示来年年景好',
  },
  '冬至': {
    key: 'theWinterSolstice',
    content: '冬至无雨，来年夏至旱',
  },
  '小寒': {
    key: 'lesserCold',
    content: '小寒大寒寒得透，来年春天天暖和',
  },
  '大寒': {
    key: 'greaterCold',
    content: '大寒一夜星，谷米贵如金',
  },
}


function View({ term }) {
  const info = termsMap[term];
  if (!info) {
    return null;
  }
  return <div className={style.terms}>
    <div className={style.title}>
      {term}
    </div>
    <div className={style.content}>
      {info.content}
    </div>
  </div>
}

export default View;
