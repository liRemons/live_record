import React from 'react';
import { useNavigate } from 'react-router';
import { Layout } from 'remons-components';
import style from './index.module.less';

const { Section } = Layout;

const Home = () => {
  const navigate = useNavigate();
  return <div className={style.home}>
    <Section title='生活小记' onClick={() => navigate('/record')} />
    <Section title='电子相册' onClick={() => navigate('/photo')} />
  </div>
}

export default Home;