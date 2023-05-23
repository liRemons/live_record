import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'antd'


const View = () => {
    const navigate = useNavigate()
    return <>
        <Button onClick={() => navigate('/login')}>login</Button>
    </>
}

export default View;