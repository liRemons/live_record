import React from 'react';
import { Image } from 'antd';
import errSvg from '../../assets/svg/文件.svg';
import style from './index.module.less'

export const mimeTypeMap = new Map([
  ['text/css', 'text'],
  ['text/html', 'text'],
  ['text/calendar', 'text'],
  ['text/javascript', 'text'],
  ['text/plain', 'text'],
  ['text/xml', 'text'],
  ['image', 'image'],
  ['audio', 'audio'],
  ['video', 'video'],
  [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc',
  ],
  ['application/msword', 'doc'],
  [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ppt',
  ],
  ['application/vnd.ms-powerpoint', 'ppt'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xls'],
  ['application/vnd.ms-excel', 'xls'],
  ['application/pdf', 'pdf'],
]);

const draw = async ({ text, id }) => {
  const c = document.getElementById(id);
  if (!c) {
    return null
  }
  const ctx = c.getContext("2d");
  ctx.font = "48px alibaba"
  await document.fonts.load(ctx.font);
  ctx.textAlign = 'center';
  ctx.textBaseline = "middle";
  ctx.fillText(`.${text}`, 100, 100);
}

export const previewMap = ({ type, url, name }) => {
  const src = `file://${url}`;

  const createIframe = (src) => <iframe frameBorder={0} src={src} />
  const transNode = (children) => {
    return <div className={style.previewBox}>
      <div className={style.previewContainer}>
        <div className={style.mark}></div>
        <div className={style.src}>
          {children}
        </div>
      </div>
      <div className={style.filename}>{name}</div>
    </div>
  }

  const obj = {
    text: transNode(createIframe(src)),
    audio: transNode(createIframe(src)),
    video: transNode(createIframe(src)),
    ppt: transNode(createIframe(src)),
    pdf: transNode(createIframe(src)),
    image: (
      transNode(<img src={src} />)
    ),
  }

  if (!obj[type]) {
    const id = `canvas${name}`;
    const text = url.split('.').length >= 2 ? url.split('.').slice(-1)[0] : '';
    if (!text) {
      return transNode(<img
        style={{ width: '50px', height: '50px' }}
        src={errSvg}
      />)
    }
    setTimeout(() => {
      draw({
        text: url.split('.').slice(-1)[0], name, id
      })
    }, 200)
    return transNode(<canvas width={200} height={200} id={id} />)
  } else {
    return obj[type]
  }
};
