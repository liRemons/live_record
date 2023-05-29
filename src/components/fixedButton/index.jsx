import React from 'react';
import { useNavigate } from 'react-router';
import FloatButton from '../floatButton';
import { CustomerServiceOutlined, CommentOutlined, HomeOutlined } from '@ant-design/icons';

const App = () => {
  const navigate = useNavigate();

  const btns = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      onClick: () => navigate('/')
    },
    {
      key: 'help',
      trigger: 'hover',
      type: 'primary',
      icon: <CustomerServiceOutlined />,
      children: [
        {
          key: 'aa'
        },
        {
          key: 'a',
          icon: <CommentOutlined />
        }
      ]
    }
  ]
  return <>
    <FloatButton components={btns} />
  </>
};

export default App;