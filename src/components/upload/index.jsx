import React, { useState, useEffect, memo } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { mimeTypeMap } from './const';
import Preview from '../preview';
import { recordUploadFile } from '../../../utils/renderer';

const { Dragger } = Upload;
const View = ({ onPropsChange, fileList: propsFileList, uploadPath, accept }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (propsFileList) {
      setFileList(propsFileList.map(item => ({ ...item, response: item })))
    }
  }, [propsFileList])

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
      const res = await recordUploadFile({
        path,
        name,
        size,
        type: mimeTypeMap.get(type) || mimeTypeMap.get(type.split('/')[0]) || 'file',
        uid,
        status: 'done',
        uploadPath
      });
      onSuccess(res, file)
    },

    onChange: ({ fileList }) => {
      setFileList([...fileList]);
      onPropsChange && onPropsChange(fileList.map(({ response }) => response))
    },
    itemRender: (node, file, fileList, event) => {
      if (file.response) {
        const { remove } = event;
        const props = { ...file, onRemove: remove, onPreview, eleId: 'model' };
        return <Preview {...props} />
      }
    }
  };

  return <>
    <Dragger accept={accept || ''} multiple {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽至此上传文件</p>
      <p className="ant-upload-hint">
        支持单个或批量上传
      </p>
    </Dragger>
  </>
}

export default memo(View);
