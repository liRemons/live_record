import React from "react";
import { Routes, Route, useRoutes } from 'react-router';
import options from './options';

const View = () => {
    return <Routes>
        {
            options.map(item => <Route {...item} key={item.path} />)
        }
    </Routes>
}

export default View;