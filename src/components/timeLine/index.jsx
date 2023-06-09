import React, { useEffect, useState, useCallback } from 'react';
import { Steps, Collapse, Empty, Button, Input, Space, Drawer, Modal } from 'antd'
import { recordGetDates } from '../../../utils/renderer';
import { ButtonBar, ActionList } from 'remons-components';
import dayjs from 'dayjs';
import Preview from '../preview';
import Upload from '../upload/index';
import Editor from '../editor/index';
import { FormOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { parseContext } from '../../../utils';
import config from '../../../electron.config.json'
import { recordRemoveSync, recordRendJson, recordWriteJson, storage } from '../../../utils/renderer';
import style from './index.module.less';

const { Panel } = Collapse;
const { confirm } = Modal;

function View({ date, changeDate, changeDates }) {
  const [dates, setDates] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [contentText, setContentText] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [handleType, setHandleType] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const getUserInfo = async () => {
    const userInfo = await storage.getItem('loginInfo') || {};
    setUserInfo(userInfo);
  }


  useEffect(() => {
    getUserInfo();
  }, [])

  const uploadPath = (date) => {
    return parseContext(config.life_notes_upload, { username: userInfo.uid, date: dayjs(date).valueOf() })
  }


  const onChangeCollapse = async (keys) => {
    setActiveKeys([...keys]);
    if (keys.length) {
      const res = await recordRendJson({ uploadPath: uploadPath(dayjs(+keys[0]).format('YYYY-MM-DD')) });
      dates.forEach(item => {
        if (+item.value === +keys[0]) {
          item.data = res;
        }
      });
      setDates([...dates])
    }
  }


  const edit = async (data) => {
    const info = await recordRendJson({ uploadPath: uploadPath(data.value) });
    if (info) {
      setFileList(info.fileList);
      setTitle(info.title);
      setContent(info.content)
      setContentText(info.contentText)
      setVisible(true);
      setHandleType('edit');
      changeDate(info.date)
    }
  }

  const del = (data) => {
    confirm({
      title: '确认删除？',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复！！！',
      onOk: async () => {
        await recordRemoveSync({
          uploadPath: uploadPath(data.date)
        });
        init();
      },
      onCancel() {
      },
    });
  }


  const create = () => {
    setFileList([]);
    setTitle(null);
    setContent(null)
    setContentText(null)
    setVisible(true);
    setHandleType('create');
  }

  const onActionClick = (key, data) => {
    const handleMap = {
      edit,
      del,
    }
    handleMap[key] && handleMap[key](data)
  }


  const renderDescription = (data) => {
    const actions = [
      {
        key: 'edit',
        type: 'link',
        icon: <FormOutlined />,
      },
      {
        key: 'del',
        type: 'link',
        danger: true,
        icon: <DeleteOutlined />,
      },
    ]
    const { data: info = {} } = data;
    return data.type === 'empty'
      ? <Empty
        description=''
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      >
        <Button type='primary' onClick={create}>记录一下</Button>
      </Empty>
      : <Collapse accordion activeKey={activeKeys} size="small" onChange={onChangeCollapse}>
        <Panel header={data.date} collapsible='icon' extra={<ActionList actions={actions} onActionClick={(key) => onActionClick(key, data)} />} key={`${data.value}`}>
          <div className={style.title}>{info.title}</div>
          <div className={style.content}> {info.contentText}</div>
          <div className={style.preview}> {
            info?.fileList?.length ? info.fileList.map(item => <Preview {...{ response: item }} />) : null
          }</div>
        </Panel>
      </Collapse>
  }

  const init = async () => {
    setActiveKeys([])
    const res = await recordGetDates({ username: userInfo.uid });
    changeDates(res)
    const data = (res || []).map(item => ({ value: +item, date: dayjs(+item).format('YYYY-MM-DD') }));
    let formatterDates = [];
    if (!(res || []).includes(`${dayjs(date).valueOf()}`)) {
      formatterDates = [
        { value: dayjs(date).valueOf(), title: date, description: '暂无数据', type: 'empty' },
        ...data,
      ]
    } else {
      formatterDates = data;
    }
    formatterDates.forEach(item => {
      if ((item.date || item.title) === date) {
        item.status = 'process'
      } else {
        item.status = 'wait'
      };
    });
    setDates([...formatterDates.sort((a, b) => b.value - a.value)])
  }

  useEffect(() => {
    init()
  }, [date, userInfo]);


  const onCancel = () => {
    setVisible(false);
    if (handleType === 'create') {
      recordRemoveSync({
        uploadPath: uploadPath(date)
      });
    }
  }

  const onSubmit = async () => {
    const data = { uploadPath: uploadPath(date), data: { fileList, content, title, date, contentText } };
    await recordWriteJson(data);
    setVisible(false);
    setTimeout(() => {
      init();
    }, 100)
    onChangeCollapse(activeKeys)
  }

  const onChangeFileList = useCallback((fileList) => {
    setFileList(fileList)
  }, [])

  const onChangeContent = useCallback((html, text) => {
    setContent(html);
    setContentText(text)
  }, [])

  const changeTitle = (e) => {
    setTitle(e.target.value)
  }

  dates.forEach(item => {
    item.description = renderDescription(item)
  });

  return <div className={style.container}>
    <Steps
      progressDot
      direction="vertical"
      items={dates}
    />
    <Drawer destroyOnClose width='90%' title='记录' open={visible} onClose={onCancel}>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}
      >
        <Input value={title} onChange={changeTitle} placeholder='起个标题吧' />
        <Upload
          fileList={fileList}
          onChange={onChangeFileList}
          uploadPath={uploadPath(date)}
        />
        <Editor content={content} onChange={onChangeContent} date={date} />
      </Space>
      <ButtonBar style={{ background: '#fff', textAlign: 'center' }}>
        <Button type="primary" onClick={onSubmit}>提交</Button>
        <Button onClick={onCancel}>取消</Button>
      </ButtonBar>
    </Drawer>
  </div>
}

export default View;