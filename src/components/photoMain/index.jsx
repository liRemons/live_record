import React, { Fragment, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { message, Popover, Segmented, InputNumber, ColorPicker, Input } from 'antd';
import cloneDeep from "lodash.clonedeep";
import { typeMap } from './const';
import config from '../../../electron.config.json';
import { v4 as uuid } from 'uuid';
import classNames from "classnames";
import { parseContext } from '../../../utils';
import Upload from '../upload';
import { storage, recordGetFilePath, recordWriteJson } from '../../../utils/renderer';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  SettingOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import style from './index.module.less';


const basicStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  fontStyle: 'inherit',
  textDecoration: 'none',
  fontWeight: 200,
  color: '#000'

}
const { TextArea } = Input;

const ReactGridLayout = WidthProvider(RGL);


const View = forwardRef((props, ref) => {
  const [layout, setLayout] = useState([])
  const [isDraggable, setIsDraggable] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const layoutRef = useRef([]);
  const userInfoRef = useRef({});

  const getUserInfo = async () => {
    const userInfo = await storage.getItem('loginInfo') || {};
    setUserInfo(userInfo)
    userInfoRef.current = userInfo;
  }

  useEffect(() => {
    getUserInfo();
    const timer = setInterval(() => {
      recordWriteJson({
        uploadPath: parseContext(`${config.photo_album}data.json/`, { pageId: '1', username: userInfoRef.current.uid }),
        data: {
          pageId: '1',
          data: layoutRef.current
        }
      })
    }, 1000 * 60)
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const addCom = () => {
    const copyLayout = cloneDeep(layout);
    copyLayout.push({
      i: uuid(),
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      minW: 2, minH: 2, resizeHandles: ['se', 'ne'],
      params: {
        uiType: 'image',
        style: basicStyle,
      }
    });
    setLayout(copyLayout)
  }

  const addText = () => {
    const copyLayout = cloneDeep(layout);
    copyLayout.push({
      i: uuid(),
      x: 0,
      y: 0,
      w: 6,
      h: 1,
      minW: 2, minH: 1, resizeHandles: ['se', 'ne'],
      params: {
        uiType: 'text',
        style: basicStyle
      }
    });
    setLayout([...copyLayout])
  }

  useImperativeHandle(ref, () => ({
    addCom,
    addText
  }))


  const setContent = (data, e) => {
    layout.forEach(item => {
      if (item.i === data.i) {
        item.params.content = e.target.value
      }
    });
    setLayout([...layout])
  }

  const changeUpload = (data, files) => {
    layout.forEach(item => {
      if (item.i === data.i) {
        item.params.content = files[0]?.thumbUrl
        item.params.fileList = files
      }
    });
    setLayout([...layout])
  }

  const onChangeSegmented = (val, id, data) => {
    let style = cloneDeep(data.params.style);
    style = {
      ...style,
      [id]: val
    }
    if (id === 'borderRadius') {
      ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].forEach(el => {
        delete style[el]
      })
    }

    layout.forEach(item => {
      if (item.i === data.i) {
        data.params.style = style
      }
    })
    setLayout([...layout])
  }

  console.log(layout);

  const renderHandleNode = ({ dataSource, data }) => {
    function renderSegmented({ options, value: id }) {
      return <Segmented
        onChange={(val) => onChangeSegmented(val, id, data)}
        value={data.params.style[id] || null}
        options={options} />
    }

    const uiTypeMap = {
      segmented: renderSegmented
    };
    return <Fragment>
      {
        dataSource.filter(item => item.isShow !== false).map((item, index) => <div key={`${item.value}+${index}`} className={style.handleItem}>
          <span className={style.label}>{item.label}</span>
          {uiTypeMap[item.uiType]?.(item) || item.render(item)}
        </div>)
      }
    </Fragment>
  }

  const settingBorderRadius = (data, key) => {
    const params = cloneDeep(data.params);
    if (params.style?.hasOwnProperty(key)) {
      delete params.style[key];
    } else {
      params.style = {
        ...(params.style || {}),
        borderRadius: null,
        [key]: 0
      }
    }

    layout.forEach(item => {
      if (item.i === data.i) {
        item.params = params;
      }
    });
    setLayout([...layout])
  }

  const renderTextPopver = (data) => {
    const dataSource = [
      {
        uiType: 'segmented',
        label: '水平对齐',
        value: 'textAlign',
        options: [
          {
            value: 'left',
            icon: <AlignLeftOutlined />
          },
          {
            value: 'center',
            icon: <AlignCenterOutlined />
          },
          {
            value: 'right',
            icon: <AlignRightOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '垂直对齐',
        value: 'alignItems',
        options: [
          {
            value: 'start',
            icon: <VerticalAlignTopOutlined />
          },
          {
            value: 'center',
            icon: <VerticalAlignMiddleOutlined />
          },
          {
            value: 'end',
            icon: <VerticalAlignBottomOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '字体宽度',
        value: 'fontWeight',
        options: [100, 200, 300, 400, 500, 600, 700, 800]
      },
      {
        uiType: 'segmented',
        label: '下划线',
        value: 'textDecoration',
        options: [
          {
            value: 'underline',
            icon: <UnderlineOutlined />
          },
          {
            value: 'none',
            icon: <StopOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '斜体',
        value: 'fontStyle',
        options: [
          {
            value: 'italic',
            icon: <ItalicOutlined />
          },
          {
            value: 'inherit',
            icon: <StopOutlined />
          }
        ]
      },
      {
        label: '字体大小',
        value: 'fontSize',
        render: () => <InputNumber value={data.params.style.fontSize} onChange={(val) => onChangeSegmented(val, 'fontSize', data)} min={12} defaultValue={14} />
      },
      {
        label: '行高',
        value: 'lineHeight',
        render: () => <InputNumber value={data.params.style.lineHeight} onChange={(val) => onChangeSegmented(val, 'lineHeight', data)} min={1} defaultValue={1.2} />
      },
      {
        label: '字体间距',
        value: 'letterSpacing',
        render: () => <InputNumber value={data.params.style.letterSpacing} min={0} onChange={(val) => onChangeSegmented(val, 'letterSpacing', data)} defaultValue={2} />
      },
      {
        label: '字体颜色',
        value: 'color',
        render: () => <ColorPicker value={data.params.style.color} onChange={(color, val) => onChangeSegmented(val, 'color', data)} />
      },
    ];
    return <Popover placement='right' trigger='click' arrow={false} onOpenChange={onOpenChange} content={<div className={style.popover}>
      <TextArea value={data.params.content} allowClear maxLength={100} showCount onChange={(e) => setContent(data, e)} />
      {
        renderHandleNode({ dataSource, data })
      }
    </div>}>
      <span className={style.icon}><SettingOutlined /></span>
    </Popover>
  }

  const renderImagePopver = (data) => {
    const dataSource = [
      {
        uiType: 'segmented',
        label: '圆形',
        value: 'borderRadius',
        options: [
          {
            value: '50%',
            icon: <CheckCircleOutlined />
          },
          {
            value: 'inherit',
            icon: <StopOutlined />
          }
        ]
      },
      {
        label: '圆角',
        value: 'borderRadius',
        render: () => {
          const options = [
            {
              value: 'borderTopLeftRadius',
              icon: <RadiusUpleftOutlined />
            },
            {
              value: 'borderTopRightRadius',
              icon: <RadiusUprightOutlined />
            },
            {
              value: 'borderBottomRightRadius',
              icon: <RadiusBottomrightOutlined />
            },
            {
              value: 'borderBottomLeftRadius',
              icon: <RadiusBottomleftOutlined />
            },
          ];

          return <div className={style.segmentedBg}>
            {
              options.map(item => <span
                key={item.value}
                onClick={() => settingBorderRadius(data, item.value)}
                className={classNames(style.icon, data.params.style?.hasOwnProperty(item.value) ? style.active : '')}
              >
                {item.icon}
              </span>)
            }
          </div>
        }
      },
      {
        label: <RadiusUpleftOutlined />,
        value: 'borderTopLeftRadius',
        render: () => <InputNumber onChange={(val) => onChangeSegmented(val, 'borderTopLeftRadius', data)} />,
        isShow: !!data.params.style?.hasOwnProperty('borderTopLeftRadius')
      },
      {
        label: <RadiusUprightOutlined />,
        value: 'borderTopRightRadius',
        render: () => <InputNumber onChange={(val) => onChangeSegmented(val, 'borderTopRightRadius', data)} />,
        isShow: !!data.params.style?.hasOwnProperty('borderTopRightRadius')
      },
      {
        label: <RadiusBottomrightOutlined />,
        value: 'borderBottomRightRadius',
        render: () => <InputNumber onChange={(val) => onChangeSegmented(val, 'borderBottomRightRadius', data)} />,
        isShow: !!data.params.style?.hasOwnProperty('borderBottomRightRadius')
      },
      {
        label: <RadiusBottomleftOutlined />,
        value: 'borderBottomLeftRadius',
        render: () => <InputNumber onChange={(val) => onChangeSegmented(val, 'borderBottomLeftRadius', data)} />,
        isShow: !!data.params.style?.hasOwnProperty('borderBottomLeftRadius')
      },
    ];

    return <Popover
      placement='right'
      trigger='click'
      arrow={false}
      onOpenChange={onOpenChange}
      content={<div className={style.popover}
      >
        <Upload
          onChange={(files) => changeUpload(data, files)}
          accept="image/*"
          listType="picture-card"
          maxCount={1}
          fileList={data.params.fileList || []}
          uploadPath={parseContext(config.photo_album, { pageId: '1', username: userInfo.uid })}
        />
        {
          renderHandleNode({ dataSource, data })
        }
      </div>}>
      <span className={style.icon}><SettingOutlined /></span>
    </Popover>
  }

  const onLayoutChange = (newLayout) => {
    const layoutRect = document.querySelector('.react-grid-layout').getBoundingClientRect();
    // 底部距视口顶部的距离
    const layoutBottomToViewportTop = layoutRect.top + layoutRect.height;
    const itemsDom = document.querySelectorAll('.react-grid-item');
    const Rects = [...itemsDom].map(item => item.getBoundingClientRect());
    const flag = Rects.some(item => (item.top + item.height) > layoutBottomToViewportTop);
    if (flag) {
      setLayout([])
      setTimeout(() => {
        setLayout(cloneDeep(layout))
      }, 0);
      message.warning('超出边框，已自动还原')
    } else {
      newLayout.forEach(item => {
        layout.forEach(el => {
          if (item.i === el.i) {
            item.params = el.params;
          }
        })
      })
      setLayout(newLayout)
    }
  }

  const changeLayoutSort = (newLayout, newItem) => {
    newLayout.forEach(item => {
      layout.forEach(el => {
        if (item.i === el.i) {
          item.params = el.params;
        }
      })
    })
    const findIndex = newLayout.findIndex(item => item.i === newItem.i);
    newLayout.splice(newLayout.length - 1, 1, ...newLayout.splice(findIndex, 1, newLayout[newLayout.length - 1]));
    onLayoutChange(newLayout)
  }

  const onDragStop = (newLayout, oldItem, newItem) => {
    changeLayoutSort(newLayout, newItem)
  }

  const onResizeStop = (newLayout, oldItem, newItem) => {
    changeLayoutSort(newLayout, newItem)
  }

  const onOpenChange = (value) => {
    setIsDraggable(!value)
  }

  const handleUiTypeMap = (data) => {
    return {
      text: renderTextPopver,
      image: renderImagePopver
    }
  }

  return (
    <ReactGridLayout
      style={{ height: '100%' }}
      isResizable
      isDraggable={isDraggable}
      className="layout"
      layout={layout}
      cols={24}
      rowHeight={40}
      maxRows={60}
      compactType={null}
      isBounded
      allowOverlap
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
    // onLayoutChange={onLayoutChange}
    >
      {
        layout.map(item => {
          return <div key={item.i} data-grid={item}>
            <Popover placement='right' arrow={false} content={
              handleUiTypeMap()[item.params.uiType](item)
            }>
              <div className={style.content}>
                {
                  typeMap(item.params)
                }
              </div>
            </Popover>
          </div>
        })
      }
    </ReactGridLayout>
  );
})


export default View;