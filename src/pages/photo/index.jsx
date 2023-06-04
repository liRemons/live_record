import React from "react";
import style from './index.module.less';
import FloatButton from '../../components/floatButton';
import PhotoMain from '../../components/photoMain';
import {
  DeleteOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  FilePdfOutlined,
  ForwardOutlined,
  FormOutlined,
  CloudUploadOutlined,
  FontSizeOutlined,
  FileZipOutlined,
  PlusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
const View = () => {
  const btns1 = [
    {
      children: [
        {
          tooltip: '新增组件',
          icon: <PlusOutlined />
        },
        {
          tooltip: '上传图片',
          key: 'upload',
          icon: <CloudUploadOutlined />
        },
        {
          tooltip: '编辑',
          key: 'edit',
          icon: <FormOutlined />
        },
        {
          tooltip: '文案设置',
          key: 'text',
          icon: <FontSizeOutlined />
        },
        
        {
          tooltip: '导出本页',
          icon: <FilePdfOutlined />,
        },
        {
          tooltip: '导出所有',
          icon: <FileZipOutlined />,
        }
      ]
    }

  ];

  const btns2 = [
    {
      children: [
        {
          tooltip: '新增一页',
          icon: <PlusCircleOutlined />
        },
        {
          tooltip: '上一页',
          icon: <CaretUpOutlined />,
        },
        {
          tooltip: '当前页',
          icon: 1
        },
        {
          tooltip: '下一页',
          icon: <CaretDownOutlined />,
        },
        {
          tooltip: '快速跳转',
          icon: <ForwardOutlined />,
        },
        {
          tooltip: '删除本页',
          icon: <DeleteOutlined />,
        },
        
      ]
    }

  ]


  return <div className={style.container}>
    <div className={style.handle}>
      <FloatButton components={btns1} shape="square" right={20} fixReference='top' position='absolute' />
    </div>

    <div className={style.main}>
      <PhotoMain />
    </div>
    <div className={style.handle}>
      <FloatButton components={btns2} shape="square" left={20} fixReference='top' position='absolute' />
    </div>
  </div>
}

export default View;