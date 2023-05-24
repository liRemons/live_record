import React, { forwardRef, useState, useEffect } from "react";
import { FormItem, ButtonBar } from 'remons-components';
import { Form, Button, Modal, Avatar, Tabs, Empty, message, List, Popconfirm } from 'antd';
import Upload from '../../components/upload';
import { useNavigate } from 'react-router';
import config from '../../../electron.config.json';
import style from './index.module.less';
import { v4 as uuid } from 'uuid';
import { recordWriteJson, recordRendJson, recordGetFilePath, storage } from '../../../utils/renderer';
import { UserOutlined, LockOutlined, PlusCircleOutlined, QuestionCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import md5 from 'js-md5';

const Login = () => {
  const navigate = useNavigate();
  const [userVisible, setUserVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const [forgetForm] = Form.useForm();
  const [userList, setUserList] = useState([])
  const [activeKey, setActiveKeys] = useState('list');
  const [handleType, setHandleType] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [editPwdVisible, setEditPwdVisible] = useState(false);
  const [editHandleType, setEditHandleType] = useState('')

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
    getList();
  }, [userVisible])

  useEffect(() => {
    forgetForm.resetFields()
  }, [editPwdVisible])

  const addUserItems = [
    {
      label: '昵称/用户名',
      name: 'nickName',
      component: 'input',
      componentProps: {
        placeholder: '请输入昵称/用户名',
        maxLength: 20,
        showCount: true
      }
    },
    {
      label: '密码',
      name: 'pwd',
      isShow: handleType === 'add',
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
      isShow: handleType === 'add',
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      rules: [
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
    },
    {
      label: '问题1',
      component: 'input',
      name: 'question_1',
      required: true,
      componentProps: {
        placeholder: '用于找回密码'
      }
    },
    {
      label: '问题2',
      component: 'input',
      name: 'question_2',
      required: true,
      componentProps: {
        placeholder: '用于找回密码'
      }
    },
    {
      isShow: handleType === 'edit',
      component: () => <Button type="link" icon={<EditOutlined />} onClick={() => {
        setEditPwdVisible(true);
        setEditHandleType('edit');
      }}>修改密码</Button>,
    }
  ].filter(item => item.isShow !== false);

  const loginItems = [
    {
      component: 'input',
      name: 'nickName',
      required: true,
      rules: [
        {
          required: true,
          message: '请输入昵称/用户名'
        }
      ],
      componentProps: {
        prefix: <UserOutlined />,
        placeholder: '请输入昵称/用户名'
      }
    },
    {
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      component: 'inputPassword',
      name: 'pwd',
      rules: [
        {
          required: true,
          message: '请输入密码'
        }
      ],
      required: true,
      componentProps: {
        prefix: <LockOutlined />,
        placeholder: '请输入密码'
      }
    },

  ]

  const forgetPwdItems = [
    {
      label: '旧密码',
      isShow: editHandleType === 'edit',
      component: 'inputPassword',
      rules: [
        () => ({
          validator(_, value) {
            if (md5(`${value}_live_record`) !== userInfo.password) {
              return Promise.reject(new Error('旧密码验证失败'));
            }
            return Promise.resolve();
          },
        }),
      ],
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      name: 'oldPwd',
      required: true,
      componentProps: {
        placeholder: '请输入旧密码',
        maxLength: 20,
      }
    },
    {
      label: '用户名/昵称',
      required: true,
      rules: [
        () => ({
          validator(_, value) {
            if (!userList.find(item => item.nickName === value)) {
              return Promise.reject(new Error('暂无此账号'));
            }
            return Promise.resolve();
          },
        }),
      ],
      isShow: editHandleType === 'forget',
      component: 'input',
      name: 'nickName',
      componentProps: {
        placeholder: '请输入要找回密码的用户名/昵称'
      }
    },
    {
      label: '问题1',
      required: true,
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            const userInfo = userList.find(item => item.nickName === getFieldValue('nickName')) || {};
            if (value !== userInfo.question_1) {
              return Promise.reject(new Error('回答不一致'));
            }
            return Promise.resolve();
          },
        }),
      ],
      isShow: editHandleType === 'forget',
      component: 'input',
      name: 'question_1',
      componentProps: {
        placeholder: '用于找回密码'
      }
    },
    {
      label: '问题2',
      required: true,
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            const userInfo = userList.find(item => item.nickName === getFieldValue('nickName')) || {}
            if (value !== userInfo.question_2) {
              return Promise.reject(new Error('回答不一致'));
            }
            return Promise.resolve();
          },
        }),
      ],
      component: 'input',
      isShow: editHandleType === 'forget',
      name: 'question_2',
      componentProps: {
        placeholder: '用于找回密码'
      }
    },
    {
      label: '新密码',
      name: 'pwd',
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
      normalize: (val) => val.replace(/[^\w_]/g, ''),
      rules: [
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
  ].filter(item => item.isShow !== false);

  const addUser = async () => {
    if (activeKey === 'list') {
      setUserVisible(false);
      return
    }
    try {
      const values = await addForm.validateFields();
      const oldList = await getList()
      const newValues = JSON.parse(JSON.stringify(values));
      if (handleType === 'add') {
        const { pwd, pwdRepeat, ...others } = newValues;
        const params = {
          password: md5(`${pwd}_live_record`),
          uuid: uuid(),
          ...others
        };
        if (oldList.find(item => item.nickName === params.nickName)) {
          message.warning('已存在相同用户');
          return
        }
        await recordWriteJson({
          uploadPath: `${config.user_config}userList/`,
          data: [...oldList, params]
        });
      } else {
        const { pwd, pwdRepeat, ...others } = newValues;
        oldList.forEach(item => {
          if (item.uuid === userInfo.uuid) {
            Object.assign(item, others)
          }
        });
        await recordWriteJson({
          uploadPath: `${config.user_config}userList/`,
          data: oldList
        });
      }


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
    try {
      const oldList = await getList();
      const values = await loginForm.validateFields();
      const info = oldList.find(item => item.nickName === values.nickName)
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
    } catch (error) {
      console.log(error);
    }
  }

  const del = async (data) => {
    const list = await getList();
    const newList = JSON.parse(JSON.stringify(list))
    const findIndex = newList.findIndex(item => item.uuid === data.uuid);
    if (findIndex !== -1) {
      newList.splice(1, findIndex);
    };
    await recordWriteJson({
      uploadPath: `${config.user_config}userList/`,
      data: newList
    });
    message.success('成功');
    getList();
  }

  const edit = (data) => {
    const { uuid, password, ...others } = data;
    setActiveKeys('add');
    setHandleType('edit');
    addForm.setFieldsValue(others);
    setUserInfo(data);

  }

  const Layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    }
  }

  const tabItems = [
    {
      label: '列表',
      key: 'list',
      children: <List
        dataSource={userList}
        renderItem={(item, index) => <List.Item actions={[
          <Button shape="circle" onClick={() => edit(item)} icon={<EditOutlined />} />,
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
      label: handleType === 'add' ? '新增用户' : '修改用户',
      key: 'add',
      children: <Form {...Layout} form={addForm}>
        {
          addUserItems.map(item => <FormItem {...item} />)
        }
      </Form>
    },
  ]

  const editPassword = async () => {
    try {
      const values = await forgetForm.validateFields();
      const oldList = await getList();
      const { pwd } = values;
      let userInfo = userInfo;
      if (editHandleType === 'forget') {
        userInfo = oldList.find(item => item.nickName === values.nickName) || {}
      }
      oldList.forEach(item => {
        if (item.uuid === userInfo.uuid) {
          item.password = md5(`${pwd}_live_record`);
        }
      });
      await recordWriteJson({
        uploadPath: `${config.user_config}userList/`,
        data: oldList
      });
      message.success('成功');
      setEditPwdVisible(false);
      setUserInfo(oldList.find(item => item.uuid === userInfo.uuid))
    } catch (error) {

    }
  }

  const forgetPwd = () => {
    setEditPwdVisible(true);
    setEditHandleType('forget');
  }

  return <>
    <div className={style.login}>
      <div className={style.container}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div className={style.form}>
          <Form form={loginForm}>
            {
              loginItems.map(item => <FormItem {...item} />)
            }
          </Form>
        </div>
        <ButtonBar bordered={false} isAffix={false}>
          <Button htmlType="submit" type='link' icon={<PlusCircleOutlined />} onClick={() => {
            setUserVisible(true);
            setHandleType('add')
          }}>新增用户</Button>
          <Button type='primary' onClick={login}>登录</Button>
          <Button type='link' onClick={forgetPwd} icon={<QuestionCircleOutlined />}>忘记密码</Button>
        </ButtonBar>
      </div>
    </div>

    <Modal destroyOnClose title='用户' onOk={addUser} onCancel={() => setUserVisible(false)} open={userVisible}>
      <Tabs onChange={(key) => setActiveKeys(key)} activeKey={activeKey} items={tabItems} />
    </Modal>
    <Modal destroyOnClose title={editHandleType === 'edit' ? '修改密码' : '忘记密码'} open={editPwdVisible} onOk={editPassword} onCancel={() => setEditPwdVisible(false)}>
      <Form {...Layout} form={forgetForm}>
        {
          forgetPwdItems.map(item => <FormItem {...item} />)
        }
      </Form>
      <Modal>

      </Modal>
    </Modal>
  </>
}

export default Login;