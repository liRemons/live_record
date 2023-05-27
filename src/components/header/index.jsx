import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Avatar } from 'antd'
import style from './index.module.less';
import classNames from 'classnames';
import { recordGetFilePath } from '../../../utils/renderer';

const View = ({ info, className, ...others }) => {
  const [src, setSrc] = useState(null);
  const url = async () => {
    const url = await recordGetFilePath(info?.avatar?.[0]?.url);
    setSrc(url)
  };

  useEffect(() => {
    url()
  }, [info]);

  const navigate = useNavigate();
  return <div className={classNames(style.header, className)}  {...others}>
    <div className={style.container}>
      <Avatar src={src} />
      <span className={style.nickName}>{info?.nickName}</span>
    </div>
  </div>
}

export default View;