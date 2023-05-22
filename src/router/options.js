import React from 'react';
import Login from '../pages/login';
import Home from '../pages/home';
import Record from '../pages/record';

export default [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/record',
        element: <Record />
    }
]