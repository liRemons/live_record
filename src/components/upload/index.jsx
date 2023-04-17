import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../../utils/renderer';
// import { filesize } from 'filesize';

function View() {
  const props = {
    name: 'file',
    customRequest: async (e) => {
      const { file: { path, name, size, type, uid } } = e;
      if (size > 1000 * 1000 * 50) {
        return
      }
      uploadFile({ path, name, size, type, uid })
    }
  };
  return <>
    <Upload {...props} multiple>
      <Button icon={<UploadOutlined />}>上传文件</Button>
    </Upload>
  </>
}

export default View;