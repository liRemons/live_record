import React, { useState, useEffect, memo, useRef } from 'react';
import { Upload } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { mimeTypeMap } from './const';
import Preview from '../preview';
import { recordUploadFile, recordGetFilePath } from '../../../utils/renderer';
import { isImageUrl } from '../../../utils';

const { Dragger } = Upload;
const View = ({ onChange: onPropsChange, fileList: propsFileList, uploadPath, listType = 'dragger', ...others }) => {
  const [fileList, setFileList] = useState([]);
  const previewRef = useRef(null)

  const init = async () => {
    const newList = propsFileList.map(async (item) => {
      const { url } = item;
      ({ ...item, response: item })
      const thumbUrl = await recordGetFilePath(url);
      const data = {
        ...item,
        thumbUrl
      };
      return {
        ...data,
        response: data
      }
    });
    const res = await Promise.all(newList)
    setFileList(res)
  }

  useEffect(() => {
    console.log();
    if (propsFileList) {
      init()
    }
  }, [propsFileList])

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
      video: openDialog
    }

    if (handles[type]) {
      handles[type]()
    }
  }

  const props = {
    name: 'file',
    fileList,
    listType,
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
      const thumbUrl = await recordGetFilePath(res.url);
      onSuccess({ ...res, thumbUrl }, file)
    },
    onChange: ({ fileList }) => {
      if (fileList.every(el => el.status === 'done')) {
        onPropsChange && onPropsChange(fileList.map(({ response }) => response))
      }
      setFileList([...fileList]);
    },
    itemRender: listType === 'dragger' ? (node, file, fileList, event) => {
      if (file.response) {
        const { remove } = event;
        const props = { ...file, onRemove: remove, onPreview, eleId: 'model' };
        return <Preview {...props} />
      }
    } : (node, file, fileList, event) => {
      return file.status === 'done' && node;
    },
    isImageUrl: (file) => isImageUrl(file),
    onPreview: (file) => previewRef.current.onPreview(file),
    ...others
  };
  const renderDragger = () => {
    return <Dragger multiple {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽至此上传文件</p>
      <p className="ant-upload-hint">
        支持单个或批量上传
      </p>
    </Dragger>;
  }

  const renderUpload = () => {
    return <Upload {...props}>
      {fileList.length >= others.maxCount ? null : <PlusOutlined />}
    </Upload>
  }

  console.log(listType);

  return <>
    {listType === 'dragger' ? renderDragger() : renderUpload()}
    <Preview ref={previewRef} handleType='preview' />
  </>
}

export default memo(View);
