import React, { useState, Fragment } from "react";
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

const View = (props) => {

  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewImgVisible, setPreviewImgVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(null);

  const onPreview = (data) => {
    const { type, url, name } = data;
    const src = `file://${url}`;
    setPreviewTitle(name);
    setPreviewSrc(src);
    const handleImg = () => {
      setPreviewImgVisible(true);
    }

    const openDialog = () => {
      setPreviewModalVisible(true);
    }
    const handles = {
      image: handleImg,
      pdf: openDialog,
      video: openDialog
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

  const { response, onRemove, eleId } = props;
  const { type, url, uid = '', name, } = response;
  const src = `file://${url}`;
  const transNode = (children, type) => {
    return (
      <div className={style.previewBox}>
        <div className={style.previewContainer}>
          <div className={style.mark}>
            <span className={style.handle}>
              <div onClick={() => onPreview(response)}>
                {type ? <DownloadOutlined /> : <EyeOutlined />}
              </div>
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
    text: transNode(createIframe(src)),
    audio: transNode(createIframe(`${src}?autoplay=no`)),
    video: transNode(createIframe(`${src}?autoplay=no`)),
    ppt: transNode(createIframe(src)),
    pdf: transNode(createIframe(src)),
    image: transNode(<img src={src} />),
  };

  let Com = null

  if (!obj[type]) {
    const id = `canvas${uid}_${eleId || ''}`;
    const text = url.split('.').length >= 2 ? url.split('.').slice(-1)[0] : '';
    if (!text) {
      Com = () => transNode(
        <img style={{ width: '50px', height: '50px' }} src={errSvg} />
      );
    }
    setTimeout(() => {
      draw({
        text: url.split('.').slice(-1)[0],
        name,
        id,
      });
    }, 200);
    Com = () => transNode(<canvas width={width} height={height} id={id} />, 'download');
  } else {
    Com = () => obj[type];
  }

  return <Fragment>
    <Com />
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible: previewImgVisible, onVisibleChange: (visible) => setPreviewImgVisible(visible) }}>
        <Image src={previewSrc} />
      </Image.PreviewGroup>
    </div>
    <Modal width={1000} footer={false} title={previewTitle} open={previewModalVisible} onCancel={() => setPreviewModalVisible(false)}>
      <iframe className={style.iframe} src={previewSrc} />
    </Modal>
  </Fragment>
};


export default View;