import React, { useState, useImperativeHandle, forwardRef } from "react";
import Upload from '../upload';
import { parseContext } from '../../../utils';
// import { recordWriteJson } from '../../../utils/renderer';
import config from '../../../electron.config.json';

const View = forwardRef((props, ref) => {
  const [fileList, setFileList] = useState([]);

  useImperativeHandle(ref, () => ({
    fileList
  }))

  const onPropsChange = (val) => {
    setFileList(val)
  }

  return <>
    <Upload
      accept='image/*'
      fileList={fileList}
      onPropsChange={onPropsChange}
      uploadPath={parseContext(config.config_background_path, { username: 'admin' })}
    />
  </>
})

export default View;