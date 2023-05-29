import React from 'react';
import Login from '../pages/login';
import Home from '../pages/home';
import Record from '../pages/record';
import Photo from '../pages/photo';

export default [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/record',
    element: <Record />,
  },
  {
    path: '/photo',
    element: <Photo />,
  },
];
