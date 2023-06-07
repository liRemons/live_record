import React, { useState, Fragment, forwardRef, useImperativeHandle } from "react";
import { DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { Image, Modal } from 'antd'
import errSvg from '../../assets/svg/文件.svg';
import style from './index.module.less';
const width = window.innerWidth <= 600 ? 100 : 200;
const height = window.innerWidth <= 600 ? 100 : 200;


const draw = async ({ text, id }) => {
  const c = document.getElementById(id);
  if (!c) {
    return null;
  }
  const ctx = c.getContext('2d');
  ctx.font = `${width === 200 ? 48 : 24}px alimama`;
  await document.fonts.load(ctx.font);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#999';
  ctx.fillText(`.${text}`, width / 2, height / 2);
};

const createIframe = (src) => (
  <iframe scrolling='no' frameBorder={0} src={src} />
);

const View = forwardRef((props, ref) => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewImgVisible, setPreviewImgVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(null);

  

  const onPreview = (data) => {
    const { type, thumbUrl, name } = data;
    setPreviewTitle(name);
    setPreviewSrc(thumbUrl);
    const handleImg = () => {
      setPreviewImgVisible(true);
    }

    const openDialog = () => {
      setPreviewModalVisible(true);
    }


    const handles = {
      image: handleImg,
      pdf: openDialog,
      video: openDialog,
      audio: openDialog
    }

    if (handles[type]) {
      handles[type]()
    } else {
      const a = document.createElement('a');
      a.setAttribute('href', src);
      a.setAttribute('download', name);
      a.click()
    }
  }

  useImperativeHandle(ref, () => ({
    onPreview
  }));

  const { response, onRemove, eleId } = props;
  const { type, thumbUrl, uid = '', name, } = response || {};
  const transNode = (children, type) => {
    return (
      <div className={style.previewBox}>
        <div className={style.previewContainer}>
          <div className={style.mark}>
            <span className={style.handle}>
              <span onClick={() => onPreview(response)}>
                {type ? <DownloadOutlined /> : <EyeOutlined />}
              </span>
              {onRemove && <DeleteOutlined onClick={() => onRemove(props)} />}
            </span>
          </div>
          <div className={style.src}>{children}</div>
        </div>
        <div className={style.filename}>{name}</div>
      </div>
    );
  };

  const obj = {
    text: (src) => createIframe(src),
    audio: (src) => <audio preload='none' controls src={src} />,
    video: (src) => <video preload='none' controls src={src} />,
    ppt: (src) => createIframe(src),
    pdf: (src) => createIframe(src),
    image: (src) => <img src={src} />,
  };

  let Com = null

  if (name && uid) {
    if (!obj[type]) {
      const id = `canvas${uid}_${eleId || ''}`;
      const text = name.split('.').length >= 2 ? name.split('.').slice(-1)[0] : '';
      if (!text) {
        Com = () => transNode(
          <img style={{ width: '50px', height: '50px' }} src={errSvg} />
        );
      }
      setTimeout(() => {
        draw({
          text: name.split('.').slice(-1)[0],
          name,
          id,
        });
      }, 200);
      Com = () => transNode(<canvas width={width} height={height} id={id} />, 'download');
    } else {
      Com = () => transNode(obj[type](thumbUrl));
    }
  }

  const { handleType } = props;

  return <Fragment>
    {handleType !== 'preview' && <Com />}
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible: previewImgVisible, onVisibleChange: (visible) => setPreviewImgVisible(visible) }}>
        <Image src={previewSrc} />
      </Image.PreviewGroup>
    </div>
    <Modal footer={false} title={previewTitle} open={previewModalVisible} onCancel={() => setPreviewModalVisible(false)}>
      {obj[type]?.(previewSrc)}
    </Modal>
  </Fragment>
});


export default View;