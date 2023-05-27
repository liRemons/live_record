import React from 'react';
import { useNavigate } from 'react-router';
import { Layout } from 'remons-components';
import style from './index.module.less';

const { Section } = Layout;

const Home = () => {
  const navigate = useNavigate();
  return <div className={style.home}>
    <Section title='记录日常' onClick={() => navigate('/record')} />
  </div>
}

export default Home;