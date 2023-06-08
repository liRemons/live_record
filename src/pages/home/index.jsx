import React from 'react';
import { useNavigate } from 'react-router';
import { Layout } from 'remons-components';
import style from './index.module.less';
import calendarSvg from '../../assets/svg/日历.svg';
import photoSvg from '../../assets/svg/相册.svg'

const { Section } = Layout;

const Home = () => {
  const navigate = useNavigate();
  return <div className={style.home}>
    <Section title='生活小记' onClick={() => navigate('/record')}>
      <img src={calendarSvg} alt="" srcset="" />
    </Section>
    <Section title='电子相册' onClick={() => navigate('/photo')}>
      <img src={photoSvg} alt="" />
    </Section>
  </div>
}

export default Home;