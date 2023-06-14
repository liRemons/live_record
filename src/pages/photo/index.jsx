import React, { useRef } from "react";
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
  FontSizeOutlined,
  FileZipOutlined,
  PlusCircleOutlined,
  FileImageOutlined
} from '@ant-design/icons';
const View = () => {
  const photoMainRef = useRef(null);

  const btns1 = [
    {
      key: 'left',
      children: [
        {
          tooltip: '图片组件',
          key: 'addCom',
          icon: <FileImageOutlined />
        },
        {
          tooltip: '文案组件',
          key: 'text',
          icon: <FontSizeOutlined />
        },
        {
          tooltip: '编辑',
          key: 'edit',
          icon: <FormOutlined />
        },
        {
          tooltip: '导出本页',
          key: 'exportPage',
          icon: <FilePdfOutlined />,
        },
        {
          tooltip: '导出所有',
          key: 'exportTotal',
          icon: <FileZipOutlined />,
        }
      ]
    }

  ];

  const btns2 = [
    {
      key: 'right',
      children: [
        {
          tooltip: '新增一页',
          key: 'addPage',
          icon: <PlusCircleOutlined />
        },
        {
          tooltip: '上一页',
          key: 'prevPage',
          icon: <CaretUpOutlined />,
        },
        {
          tooltip: '当前页',
          key: 'nowPage',
          icon: 1
        },
        {
          tooltip: '下一页',
          key: 'nextPage',
          icon: <CaretDownOutlined />,
        },
        {
          tooltip: '快速跳转',
          key: 'toPage',
          icon: <ForwardOutlined />,
        },
        {
          tooltip: '删除本页',
          key: 'delPage',
          icon: <DeleteOutlined />,
        },
        
      ]
    }

  ]

  const handleClick = (data) => {
    const handleMap = {
      addCom: photoMainRef.current.addCom,
      text: photoMainRef.current.addText
    }
    if(handleMap[data.key]) {
      handleMap[data.key]()
    }
  }

  return <div className={style.container}>
    <div className={style.handle}>
      <FloatButton onClick={handleClick} components={btns1} shape="square" right={20} fixReference='top' position='absolute' />
    </div>
    <div className={style.main}>
      <PhotoMain ref={photoMainRef} />
    </div>
    <div className={style.handle}>
      <FloatButton onClick={handleClick} components={btns2} shape="square" left={20} fixReference='top' position='absolute' />
    </div>
  </div>
}

export default View;