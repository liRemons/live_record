import React, { useState } from 'react';
import { Upload, Image, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../utils/renderer';
import { mimeTypeMap, previewMap } from './const';
import style from './index.module.less';

const { Dragger } = Upload;
function View({ date }) {
  const [fileList, setFileList] = useState([]);
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
    }
  }

  const props = {
    name: 'file',
    fileList,
    customRequest: async (e) => {
      const { file, file: { path, name, size, type, uid }, onSuccess } = e;
      if (size > 1000 * 1000 * 50) {
        return
      };
      const res = await uploadFile({
        path,
        date,
        name,
        size,
        type: mimeTypeMap.get(type) || mimeTypeMap.get(type.split('/')[0]) || 'file',
        uid,
        status: 'done',
      });
      onSuccess(res, file)
    },

    onChange: ({ fileList }) => {
      setFileList([...fileList])
    },
    itemRender: (node, file, fileList, event) => {
      if (file.response) {
        const { remove } = event;
        return previewMap({ ...file, onRemove: remove, onPreview })
      }
    }
  };

  return <>
    <Dragger multiple {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽至此上传文件</p>
      <p className="ant-upload-hint">
        支持单个或批量上传
      </p>
    </Dragger>
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible: previewImgVisible, onVisibleChange: (visible) => setPreviewImgVisible(visible) }}>
        <Image src={previewSrc} />
      </Image.PreviewGroup>
    </div>
    <Modal width={1000} footer={false} title={previewTitle} open={previewModalVisible} onCancel={() => setPreviewModalVisible(false)}>
      <iframe className={style.iframe} src={previewSrc} />
    </Modal>
    
  </>
}

export default View;
