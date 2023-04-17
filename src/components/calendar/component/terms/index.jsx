import React from "react";
// 立春 the Beginning of Spring
import theBeginningOfSpring from '../../../../assets/svg/立春.svg';
// 雨水 Rain Water
import rainWater from '../../../../assets/svg/雨水.svg';
// 惊蛰 the Waking of Insects
import theWakingOfInsects from '../../../../assets/svg/惊蛰.svg';
// 春分 the Spring Equinox
import theSpringEquinox from '../../../../assets/svg/春分.svg';
// 清明 Pure Brightness
import pureBrightness from '../../../../assets/svg/清明.svg';
// 谷雨 Grain Rain
import grainRain from '../../../../assets/svg/谷雨.svg';
// 立夏 the Beginning of Summer
import theBeginningOfSummer from '../../../../assets/svg/立夏.svg';
// 小满 Lesser Fullness of Grain
import lesserFullnessOfGrain from '../../../../assets/svg/小满.svg';
// 芒种 Grain in Beard
import grainInBeard from '../../../../assets/svg/芒种.svg';
// 夏至 the Summer Solstice
import theSummerSolstice from '../../../../assets/svg/夏至.svg';
// 小暑 Lesser Heat
import lesserHeat from '../../../../assets/svg/小暑.svg';
// 大暑 Greater Heat
import greaterHeat from '../../../../assets/svg/大暑.svg';
// 立秋 the Beginning of Autumn
import theBeginningOfAutumn from '../../../../assets/svg/立秋.svg';
// 处暑 the End of Heat
import theEndOfHeat from '../../../../assets/svg/处暑.svg';
// 白露 White Dew
import whiteDew from '../../../../assets/svg/白露.svg';
// 秋分 the Autumn Equinox
import theAutumnEquinox from '../../../../assets/svg/秋分.svg';
// 寒露 Cold Dew
import coldDew from '../../../../assets/svg/寒露.svg';
// 霜降 Frost's Descent
import frostsDescent from '../../../../assets/svg/霜降.svg';
// 立冬 the Beginning of Winter
import theBeginningOfWinter from '../../../../assets/svg/立冬.svg';
// 小雪 Lesser Snow
import lesserSnow from '../../../../assets/svg/小雪.svg';
// 大雪 Greater Snow
import greaterSnow from '../../../../assets/svg/大雪.svg';
// 冬至 the Winter Solstice
import theWinterSolstice from '../../../../assets/svg/冬至.svg';
// 小寒 Lesser Cold
import lesserCold from '../../../../assets/svg/小寒.svg';
// 大寒 Greater Cold
import greaterCold from '../../../../assets/svg/大寒.svg';

import style from './index.module.less';

const termsMap = {
  '立春': {
    key: 'theBeginningOfSpring',
    content: '阳和启蛰，品物皆春',
    icon: theBeginningOfSpring
  },
  '雨水': {
    key: 'rainWater',
    content: '立春天渐暖，雨水送肥忙',
    icon: rainWater,
  },
  '惊蛰': {
    key: 'theWakingOfInsects',
    content: '惊蛰一犁地，春分地气通',
    icon: theWakingOfInsects
  },
  '春分': {
    key: 'theSpringEquinox',
    content: '春分有雨是丰年',
    icon: theSpringEquinox
  },
  '清明': {
    key: 'pureBrightness',
    content: '清明有雨麦田肥，谷雨有雨好种棉',
    icon: pureBrightness
  },
  '谷雨': {
    key: 'grainRain',
    content: '谷雨前后，种瓜种豆',
    icon: grainRain
  },
  '立夏': {
    key: 'theBeginningOfSummer',
    content: '立夏不热，五谷不接',
    icon: theBeginningOfSummer
  },
  '小满': {
    key: 'theBeginningOfSummer',
    content: '小满十日遍地黄',
    icon: lesserFullnessOfGrain
  },
  '芒种': {
    key: 'grainInBeard',
    content: '芒种火烧天，夏至雨涟涟',
    icon: grainInBeard
  },
  '夏至': {
    key: 'theSummerSolstice',
    content: '夏至一场雨，一滴值千金',
    icon: theSummerSolstice
  },
  '小暑': {
    key: 'lesserHeat',
    content: '小暑过，一日热三分',
    icon: lesserHeat
  },
  '大暑': {
    key: 'greaterHeat',
    content: '大暑小暑，淹死老鼠',
    icon: greaterHeat
  },
  '立秋': {
    key: 'theBeginningOfAutumn',
    content: '立秋下雨，百日无霜',
    icon: theBeginningOfAutumn
  },
  '处暑': {
    key: 'theEndOfHeat',
    content: '处暑雨，粒粒皆米稻',
    icon: theEndOfHeat
  },
  '白露': {
    key: 'whiteDew',
    content: '白露秋分夜，一夜凉一夜',
    icon: whiteDew
  },
  '秋分': {
    key: 'theAutumnEquinox',
    content: '秋风稻见黄，大风要提防',
    icon: theAutumnEquinox
  },
  '寒露': {
    key: 'coldDew',
    content: '寒露收山楂，霜降刨地瓜',
    icon: coldDew
  },
  '霜降': {
    key: 'frostsDescent',
    content: '霜降播种，立冬见苗',
    icon: frostsDescent
  },
  '立冬': {
    key: 'theBeginningOfWinter',
    content: '立冬北风冰雪多，立冬南风无雨雪',
    icon: theBeginningOfWinter
  },
  '小雪': {
    key: 'lesserSnow',
    content: '小雪大雪不见雪，小麦大麦粒要瘪',
    icon: lesserSnow
  },
  '大雪': {
    key: 'greaterSnow',
    content: '大雪到来大雪飘，兆示来年年景好',
    icon: greaterSnow
  },
  '冬至': {
    key: 'theWinterSolstice',
    content: '冬至无雨，来年夏至旱',
    icon: theWinterSolstice
  },
  '小寒': {
    key: 'lesserCold',
    content: '小寒大寒寒得透，来年春天天暖和',
    icon: lesserCold
  },
  '大寒': {
    key: 'greaterCold',
    content: '大寒一夜星，谷米贵如金',
    icon: greaterCold
  },
}


function View({ term }) {
  const info = termsMap[term];
  if (!info) {
    return null;
  }
  return <div className={style.terms}>
    
    <img src={info.icon} alt="" />
    <div className={style.title}>
      {term}
    </div>
    <div className={style.content}>
      {
        info.content.split('，').map(item => <span>
          {item}
        </span>)
      }
    </div>
  </div>
}

export default View;
