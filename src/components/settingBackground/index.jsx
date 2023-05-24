import React, { useState, useEffect, useCallback } from "react";
import Upload from '../upload';
import { Steps, Button, Empty, Image, Checkbox, message } from 'antd';
import { parseContext } from '../../../utils';
import { ButtonBar } from 'remons-components';
import style from './index.module.less';
import { EyeOutlined } from '@ant-design/icons';
import config from '../../../electron.config.json';
import classNames from "classnames";
import { recordWriteJson, recordRendJson, recordGetFilePath } from '../../../utils/renderer';

const View = (props) => {
  const [fileList, setFileList] = useState([]);
  const [stepCurrent, setStepCurrent] = useState(0)
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewImgVisible, setPreviewImgVisible] = useState(false);
  const [activeUid, setActiveUid] = useState('');

  useEffect(() => {
    recordRendJson({ uploadPath: parseContext(config.config_background_path, { username: 'admin' }) }).then(async (res) => {
      if (res) {
        const promiseAll = res.fileList.map(async (item) => {
          const thumbUrl =  await recordGetFilePath(item.url);
          return {
            thumbUrl,
            ...item
          }
        })
       const fileList= await Promise.all(promiseAll);
        setFileList(fileList || [])
        setActiveUid(res.uid)
      }
    });
  }, [])


  const onPropsChange = useCallback((fileList) => {
    setFileList(fileList)
  }, [])

  const onPreview = (data) => {
    setPreviewSrc(data.url);
    setPreviewImgVisible(true)
  }

  const onSelect = (e, data) => {
    if (e.target.checked) {
      setActiveUid(data.uid)
    } else {
      setActiveUid()
    }
  }

  const renderSelectBackground = () => {
    if (!fileList.filter(Boolean).length) {
      return <Empty
        description='暂无数据'
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
    }

    return <div className={style.selectBox}>
      {
        fileList.filter(Boolean).map(item => <div className={classNames(style.img_container, item.uid === activeUid && style.active)} key={item.uid}>
          <Checkbox className={style.checkbox} checked={item.uid === activeUid} onChange={(e) => onSelect(e, item)} />
          <div className={style.mark}>
            <div className={style.handle}>
              <EyeOutlined onClick={() => onPreview(item)} />
            </div>
          </div>
          <img src={item.thumbUrl} alt="" />
        </div>)
      }
    </div>
  }

  const steps = [
    {
      title: '上传背景图',
      content: <Upload
        accept='image/*'
        fileList={fileList}
        onChange={onPropsChange}
        uploadPath={`${parseContext(config.config_background_path, { username: 'admin' })}/upload/`}
      />,
    },
    {
      title: '设置背景图',
      content: renderSelectBackground(),
    },
  ];

  const next = () => {
    setStepCurrent(stepCurrent + 1)
  }

  const prev = () => {
    setStepCurrent(stepCurrent - 1)
  }

  const onSubmit = (fileList, uid) => {
    if (!uid) {
      message.warning('未选择背景图');
      return;
    }
    const info = fileList.find(el => el.uid === uid);
    if (info) {
      document.documentElement.style.setProperty(
        "--bg",
        `url(${info.thumbUrl})`
      );
    }
    recordWriteJson({
      uploadPath: parseContext(config.config_background_path, { username: 'admin' }),
      data: {
        fileList: fileList,
        uid,
      }
    })
    props.onCancel()
  }

  return <>
    <Steps current={stepCurrent} items={steps} />
    {
      steps[stepCurrent].content
    }
    <ButtonBar bordered={false} isAffix={false}>
      {!!stepCurrent && <Button onClick={prev}>上一步</Button>}
      {stepCurrent !== steps.length - 1 && <Button type="primary" onClick={next}>下一步</Button>}
      <Button type="primary" onClick={() => onSubmit(fileList, activeUid)}>确定</Button>
      <Button onClick={props.onCancel}>取消</Button>
    </ButtonBar>
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible: previewImgVisible, onVisibleChange: (visible) => setPreviewImgVisible(visible) }}>
        <Image src={previewSrc} />
      </Image.PreviewGroup>
    </div>
  </>
}

export default View;