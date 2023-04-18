import React from 'react';
import { Image } from 'antd';
import errSvg from '../../assets/svg/文件.svg';

export const mimeTypeMap = new Map([
  ['text', 'text'],
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

export const previewMap = (type, url) => {
  const src = `file://${url}`;
  return (
    {
      text: <iframe width={200} height={200} src={src} />,
      audio: <iframe width={200} height={200} src={src} />,
      video: <iframe width={200} height={200} src={src} />,
      ppt: <iframe width={200} height={200} src={src} />,
      pdf: <iframe width={200} height={200} src={src} />,
      image: (
        <Image
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
          src={src}
        />
      ),
    }[type] || (
      <Image
        width={200}
        height={200}
        src='error'
        fallback={errSvg}
      />
    )
  );
};
