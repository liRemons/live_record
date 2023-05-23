import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'antd';

const Home = () => {
  const navigate = useNavigate();
  return <>
    <Button onClick={() => navigate('/record')}>记录日常</Button>
    <Button>电子相册</Button>
  </>
}

export default Home;