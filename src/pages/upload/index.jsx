import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../../utils/renderer';

function View() {
  const props = {
    name: 'file',
    customRequest: (e) => {
      const { file: { path, name, size, type, uid } } = e;
      uploadFile({ path, name, size, type, uid })
    }
  };
  return <>
    <Upload {...props} multiple>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  </>
}

export default View;