import React, { forwardRef, useState } from "react";
import { FormItem, ButtonBar } from 'remons-components';
import { Form, Button, Modal, Avatar, Space } from 'antd'
import Upload from '../../components/upload';
import config from '../../../electron.config.json';
import { Link } from 'react-router-dom';
import style from './index.module.less';
import { UserOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const Login = () => {
  const [userVisible, setUserVisible] = useState(false);
  const [form] = Form.useForm();

  const addUserItems = [
    {
      label: '用户名/昵称',
      name: 'name',
      component: 'input',
      required: true,
      componentProps: {
        placeholder: '请设置名称'
      }
    },
    {
      label: '密码',
      name: 'pwd',
      component: 'inputPassword',
      required: true,
      componentProps: {
        placeholder: '请设置密码'
      }
    },
    {
      label: '再次输入密码',
      name: 'pwdRepeat',
      component: 'inputPassword',
      required: true,
      componentProps: {
        placeholder: '再次输入密码'
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
    },
    {
      label: '密码',
      component: 'inputPassword',
    }
  ]

  const addUser = () => {
    console.log(form.getFieldsValue());
  }

  const Layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    }
  }

  return <>
    <div className={style.login}>
      <div className={style.container}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div className={style.form}>
          <Form  {...Layout} form={form}>
            {
              loginItems.map(item => <FormItem {...item} />)
            }
          </Form>
        </div>
        <Space>
        <Button type='link' icon={<PlusCircleOutlined />} onClick={() => setUserVisible(true)}>新增用户</Button>
        <Button type='primary'>登录</Button>
        <Button type='link' icon={<QuestionCircleOutlined />}>忘记密码</Button>
          {/* <Link to='/'>首页</Link> */}
        </Space>
        

      </div>
    </div>

    <Modal title='用户' onOk={addUser} onCancel={() => setUserVisible(false)} open={userVisible}>
      <Form form={form}>
        {
          addUserItems.map(item => <FormItem {...item} />)
        }
      </Form>
    </Modal>


  </>
}

export default Login;