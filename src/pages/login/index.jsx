import React, { forwardRef, useState, useEffect } from "react";
import { FormItem } from 'remons-components';
import { Form, Button, Modal, Avatar, Space, Tabs, Empty, message, List, Popconfirm } from 'antd';
import Upload from '../../components/upload';
import { useNavigate } from 'react-router';
import config from '../../../electron.config.json';
import style from './index.module.less';
import { recordWriteJson, recordRendJson, recordGetFilePath, storage } from '../../../utils/renderer';
import { UserOutlined, PlusCircleOutlined, QuestionCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import md5 from 'js-md5';

const Login = () => {
  const navigate = useNavigate();
  const [userVisible, setUserVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const [userList, setUserList] = useState([])
  const [activeKey, setActiveKeys] = useState('list');

  const rules = [
    {
      required: true
    }
  ];

  const getList = async () => {
    const list = await recordRendJson({ uploadPath: `${config.user_config}userList/`, });
    const newList = (list || []).map(async (item) => {
      const thumbUrl = item.avatar?.[0]?.url ? await recordGetFilePath(item.avatar?.[0]?.url) : null;
      return {
        ...item,
        thumbUrl
      }
    })
    const res = await Promise.all(newList)
    setUserList(res || []);
    return list || [];
  }

  useEffect(() => {
    addForm.resetFields();
    if (userVisible) {
      getList()
    }
  }, [userVisible])

  const addUserItems = [
    {
      label: '用户名',
      name: 'name',
      component: 'input',
      required: true,
      rules,
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      componentProps: {
        placeholder: '可输入下划线、英文、字母，唯一ID不可更改',
        maxLength: 20,
        showCount: true
      }
    },
    {
      label: '昵称',
      name: 'nickName',
      component: 'input',
      componentProps: {
        placeholder: '请设置昵称',
        maxLength: 20,
        showCount: true
      }
    },
    {
      label: '密码',
      name: 'pwd',
      rules,
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      component: 'inputPassword',
      required: true,
      componentProps: {
        placeholder: '请设置 20 位以内密码，下划线、英文、字母',
        maxLength: 20,
      }
    },
    {
      label: '验证密码',
      name: 'pwdRepeat',
      rules: [
        ...rules,
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('pwd') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次密码不一致'));
          },
        }),
      ],
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      component: 'inputPassword',
      required: true,
      componentProps: {
        placeholder: '再次输入密码',
        maxLength: 20,
      }
    },
    {
      label: '头像',
      name: 'avatar',
      component: forwardRef((props) => <Upload {...props} />),
      valuePropName: 'fileList',
      componentProps: {
        maxCount: 1,
        multiple: false,
        accept: 'image/*',
        uploadPath: `${config.user_config}upload/`,
        listType: 'picture-circle'
      }
    }
  ];

  const loginItems = [
    {
      label: '用户名',
      component: 'input',
      name: 'name',
      rules,
      required: true
    },
    {
      label: '密码',
      component: 'inputPassword',
      rules,
      name: 'pwd',
      required: true
    }
  ]

  const addUser = async () => {
    if (activeKey === 'list') {
      setUserVisible(false);
      return
    }
    try {
      const values = await addForm.validateFields();
      const oldList = await getList()
      const newValues = JSON.parse(JSON.stringify(values));
      const { pwd, pwdRepeat, ...others } = newValues;
      const params = {
        password: md5(`${pwd}_live_record`),
        ...others
      };
      if (oldList.find(item => item.name === params.name)) {
        message.warning('已存在相同用户');
        return
      }
      await recordWriteJson({
        uploadPath: `${config.user_config}userList/`,
        data: [...oldList, params]
      });
      message.success('成功');
      setUserVisible(false);
    } catch (error) {
      console.log(error);
    }
  }

  const changeAddUser = () => {
    setActiveKeys('add')
  }

  const login = async () => {
    const oldList = await getList();
    const values = await loginForm.validateFields();
    const info = oldList.find(item => item.name === values.name)
    if (info) {
      if (info.password === md5(`${values.pwd}_live_record`)) {
        message.success('成功');
        storage.setItem('loginInfo', info)
        navigate('/')
      } else {
        message.error('密码验证失败');
      }
    } else {
      message.error('暂无此用户')
    }
  }

  const del = (data) => {}

  const Layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    }
  }

  const tabItems = [
    {
      label: '列表',
      key: 'list',
      children: <List
        dataSource={userList}
        renderItem={(item, index) => <List.Item actions={[
          <Button shape="circle" icon={<EditOutlined />} />,
          <Popconfirm
            title="删除"
            description="该账号下的内容也会被清空，删除后不可恢复！！！"
            onConfirm={() => del(item)}
            okText="确定"
            cancelText="取消"
          >
            <Button shape="circle" danger icon={<DeleteOutlined />} />
          </Popconfirm>]}>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} src={item.thumbUrl} />}
            title={item.name}
            description={item.nickName}

          />
        </List.Item>}
      >
        {
          userList.length ? '' : <Empty>
            <Button type='primary' onClick={changeAddUser}>新增用户</Button>
          </Empty>
        }
      </List>
    },
    {
      label: '新增用户',
      key: 'add',
      children: <Form {...Layout} form={addForm}>
        {
          addUserItems.map(item => <FormItem {...item} />)
        }
      </Form>
    },
  ]

  return <>
    <div className={style.login}>
      <div className={style.container}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div className={style.form}>
          <Form  {...Layout} form={loginForm}>
            {
              loginItems.map(item => <FormItem {...item} />)
            }
          </Form>
        </div>
        <Space>
          <Button type='link' icon={<PlusCircleOutlined />} onClick={() => setUserVisible(true)}>新增用户</Button>
          <Button type='primary' onClick={login}>登录</Button>
          <Button type='link' icon={<QuestionCircleOutlined />}>忘记密码</Button>
        </Space>
      </div>
    </div>

    <Modal destroyOnClose title='用户' onOk={addUser} onCancel={() => setUserVisible(false)} open={userVisible}>
      <Tabs onChange={(key) => setActiveKeys(key)} activeKey={activeKey} items={tabItems} />
    </Modal>
  </>
}

export default Login;