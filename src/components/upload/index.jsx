import React, { useState } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../utils/renderer';
import { mimeTypeMap, previewMap } from './const';
import style from './index.module.less';
const { Dragger } = Upload;
function View() {
  const [fileList, setFileList] = useState([]);

  const props = {
    name: 'file',
    customRequest: async (e) => {
      console.log(e);
      const { file, file: { path, name, size, type, uid }, onSuccess } = e;
      if (size > 1000 * 1000 * 50) {
        return
      };
      const res = await uploadFile({
        path,
        name,
        size,
        type: mimeTypeMap.get(type) || mimeTypeMap.get(type.split('/')[0]) || 'file',
        uid
      });
      onSuccess(res, file)
    },

    onChange: (e) => {
      setFileList(e.fileList.filter(item => item.status === 'done').map(item => item.response));
    },
    itemRender: () => { }
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
    <div className={style.preview}>
      {
        fileList.map(item => previewMap(item))
      }
    </div>
    <canvas id="canvas-1" width="400" height="500"></canvas>
  </>
}

export default View;
