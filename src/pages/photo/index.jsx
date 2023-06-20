import React, { useRef, useState, useEffect } from "react";
import style from './index.module.less';
import FloatButton from '../../components/floatButton';
import PhotoMain from '../../components/photoMain';
import config from '../../../electron.config.json';
import { storage, recordWriteJson, recordRendJson } from '../../../utils/renderer';
import { parseContext } from '../../../utils';
import { v4 as uuid } from 'uuid';
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
  FileImageOutlined,
  SaveOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { message, Modal } from "antd";

const { confirm } = Modal;

const View = () => {
  const photoMainRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [nowPage, setNowPage] = useState(null);
  const [pages, setPages] = useState([]);

  const btns1 = [
    {
      key: 'left',
      children: [
        {
          tooltip: '图片组件',
          key: 'addCom',
          isShow: edit,
          icon: <FileImageOutlined />
        },
        {
          tooltip: '文案组件',
          key: 'text',
          isShow: edit,
          icon: <FontSizeOutlined />
        },
        {
          tooltip: '编辑',
          key: 'edit',
          isShow: !edit,
          icon: <FormOutlined />
        },
        {
          tooltip: '保存',
          key: 'save',
          isShow: edit,
          icon: <SaveOutlined />
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
      ].filter(item => item.isShow !== false)
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
          tooltip: `当前页, 共${pages.length}页`,
          key: 'nowPage',
          icon: nowPage?.page + 1
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

  const getUserInfo = async () => {
    const userInfo = await storage.getItem('loginInfo') || {};
    setUserInfo(userInfo)
  }

  const getNowPage = async () => {
    if (!userInfo) {
      return;
    }
    const pageInfo = await recordRendJson({
      uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid })
    });
    if (!pageInfo?.nowPage) {
      const nowPage = {
        pageId: uuid(),
        page: 0
      };
      recordWriteJson({
        uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid }),
        data: {
          nowPage,
          pages: [
            nowPage
          ]
        }
      });
      setNowPage(nowPage);
      setPages([nowPage])
    } else {
      setNowPage(pageInfo.nowPage)
      setPages(pageInfo.pages);
    }
  }

  const addPage = async () => {
    const nowPage = {
      pageId: uuid(),
      page: pages.length
    };
    const newPages = [
      ...pages,
      nowPage
    ]
    recordWriteJson({
      uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid }),
      data: {
        nowPage,
        pages: newPages
      }
    });
    setPages(newPages)
    setNowPage(nowPage)
  }

  const prevPage = async () => {
    if (nowPage.page) {
      setNowPage(pages[nowPage.page - 1]);
      recordWriteJson({
        uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid }),
        data: {
          nowPage: pages[nowPage.page - 1],
          pages
        }
      });
    } else {
      message.warning('已是第一页')
    }
  }

  const nextPage = async () => {
    if (nowPage.page < pages.length - 1) {
      setNowPage(pages[nowPage.page + 1])
      recordWriteJson({
        uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid }),
        data: {
          nowPage: pages[nowPage.page + 1],
          pages
        }
      });
    } else {
      message.warning('已是最后一页')
    }
  }

  const delPage = () => {
    confirm({
      title: '确定要删除吗',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复！！！',
      onOk: () => {
        const findIndex = pages.findIndex(item => item.pageId === nowPage.pageId);
        pages.splice(findIndex, 1);
        const newPages = pages.map((item, index) => ({ ...item, page: index }))
        const newNowPage = newPages.length === 0
          ? { pageId: uuid(), page: 0 }
          : newPages[nowPage.page - 1];
        recordWriteJson({
          uploadPath: parseContext(`${config.photo_album_page}`, { username: userInfo.uid }),
          data: {
            nowPage: newNowPage,
            pages: newPages.length ? newPages : [newNowPage]
          }
        });
        setNowPage(newNowPage);
        setPages(newPages.length ? newPages : [newNowPage]);
      },
      onCancel() { },
    });

  }

  console.log(pages, nowPage);


  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    getNowPage();
  }, [userInfo])



  const handleClick = (data) => {
    const handleMap = {
      addCom: photoMainRef.current.addCom,
      text: photoMainRef.current.addText,
      edit: () => setEdit(true),
      save: () => {
        setEdit(false);
        photoMainRef.current.save();
      },
      addPage,
      prevPage,
      nextPage,
      delPage
    }
    if (handleMap[data.key]) {
      handleMap[data.key]()
    }
  }


  return <div className={style.container}>
    <div className={style.handle}>
      <FloatButton onClick={handleClick} components={btns1} shape="square" right={20} fixReference='top' position='absolute' />
    </div>
    <div className={style.main}>
      {userInfo && nowPage && <PhotoMain nowPage={nowPage} userInfo={userInfo} edit={edit} ref={photoMainRef} />}
    </div>
    <div className={style.handle}>
      <FloatButton onClick={handleClick} components={btns2} shape="square" left={20} fixReference='top' position='absolute' />
    </div>

  </div>
}

export default View;