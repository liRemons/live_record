import React, { Fragment, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { message, Popover, Segmented, InputNumber, ColorPicker, Input } from 'antd';
import { typeMap } from './const';
import { v4 as uuid } from 'uuid';
import classNames from "classnames";

const { TextArea } = Input;

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

const ReactGridLayout = WidthProvider(RGL);


const View = forwardRef((props, ref) => {
  const [layout, setLayout] = useState([])
  const [isDraggable, setIsDraggable] = useState(true)

  useEffect(() => {
  }, [])

  const addCom = () => {
    const copyLayout = JSON.parse(JSON.stringify(layout));
    copyLayout.push({
      i: uuid(),
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      minW: 2, minH: 2, resizeHandles: ['se', 'ne'],
      params: {
        uiType: 'image'
      }
    });
    setLayout(copyLayout)
  }

  const addText = () => {
    const copyLayout = JSON.parse(JSON.stringify(layout));
    copyLayout.push({
      i: uuid(),
      x: 0,
      y: 0,
      w: 6,
      h: 1,
      minW: 2, minH: 1, resizeHandles: ['se', 'ne'],
      params: {
        uiType: 'text'
      }
    });
    setLayout(copyLayout)
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

  const renderHandleNode = ({ dataSource }) => {
    function renderSegmented({ options }) {
      return <Segmented
        options={options} />
    }

    const uiTypeMap = {
      segmented: renderSegmented
    };
    return <Fragment>
      {
        dataSource.filter(item => item.isShow !== false).map(item => <div key={item.value} className={style.handleItem}>
          <span className={style.label}>{item.label}</span>
          {uiTypeMap[item.uiType]?.(item) || item.render(item)}
        </div>)
      }
    </Fragment>
  }

  const settingBorderRadius = (data, key) => {
    const params = data.params;
    if (params.style?.hasOwnProperty(key)) {
      delete params.style?.[key];
    } else {
      params.style = {
        ...(params.style || {}),
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
            value: 'center',
            icon: <AlignCenterOutlined />
          },
          {
            value: 'left',
            icon: <AlignLeftOutlined />
          }, {
            value: 'right',
            icon: <AlignRightOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '垂直对齐',
        value: 'vertical',
        options: [
          {
            value: 'top',
            icon: <VerticalAlignTopOutlined />
          },
          {
            value: 'middle',
            icon: <VerticalAlignMiddleOutlined />
          }, {
            value: 'bottom',
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
            value: 'none',
            icon: <StopOutlined />
          }
        ]
      },
      {
        label: '字体大小',
        value: 'fontSize',
        render: () => <InputNumber min={12} defaultValue={14} />
      },
      {
        label: '行高',
        value: 'lineHeight',
        render: () => <InputNumber min={12} defaultValue={14} />
      },
      {
        label: '字体间距',
        value: 'letterSpace',
        render: () => <InputNumber min={0} defaultValue={2} />
      },
      {
        label: '字体颜色',
        value: 'color',
        render: () => <ColorPicker />
      },
    ];
    return <Popover placement='right' trigger='click' arrow={false} onOpenChange={onOpenChange} content={<div className={style.popover}>
      <TextArea allowClear maxLength={100} showCount onChange={(e) => setContent(data, e)} />
      {
        renderHandleNode({ dataSource })
      }
    </div>}>
      <span className={style.icon}><SettingOutlined /></span>
    </Popover>
  }

  const renderImagePopver = (data) => {
    const dataSource = [
      {
        uiType: 'segmented',
        label: '水平对齐',
        options: [
          {
            value: 'List',
            icon: <AlignCenterOutlined />
          },
          {
            value: 'Kanban',
            icon: <AlignLeftOutlined />
          }, {
            value: 'a',
            icon: <AlignRightOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '垂直对齐',
        options: [
          {
            value: 'List',
            icon: <VerticalAlignTopOutlined />
          },
          {
            value: 'Kanban',
            icon: <VerticalAlignMiddleOutlined />
          }, {
            value: 'a',
            icon: <VerticalAlignBottomOutlined />
          }
        ]
      },
      {
        uiType: 'segmented',
        label: '圆形',
        options: [
          {
            value: 'List',
            icon: <CheckCircleOutlined />
          },
          {
            value: 'none',
            icon: <StopOutlined />
          }
        ]
      },
      {
        label: '圆角',
        render: () => {
          const options = [
            {
              value: 'border-top-left-radius',
              icon: <RadiusUpleftOutlined />
            },
            {
              value: 'border-top-right-radius',
              icon: <RadiusUprightOutlined />
            },
            {
              value: 'border-bottom-right-radius',
              icon: <RadiusBottomrightOutlined />
            },
            {
              value: 'border-bottom-left-radius',
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
        render: () => <InputNumber />,
        isShow: !!data.params.style?.hasOwnProperty('border-top-left-radius')
      },
      {
        label: <RadiusUprightOutlined />,
        render: () => <InputNumber />,
        isShow: !!data.params.style?.hasOwnProperty('border-top-right-radius')
      },
      {
        label: <RadiusBottomrightOutlined />,
        render: () => <InputNumber />,
        isShow: !!data.params.style?.hasOwnProperty('border-bottom-right-radius')
      },
      {
        label: <RadiusBottomleftOutlined />,
        render: () => <InputNumber />,
        isShow: !!data.params.style?.hasOwnProperty('border-bottom-left-radius')
      },
    ];

    return <Popover placement='right' trigger='click' arrow={false} onOpenChange={onOpenChange} content={<div className={style.popover}>
      {
        renderHandleNode({ dataSource })
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
        setLayout(JSON.parse(JSON.stringify(layout)))
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
    setLayout([...newLayout])
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
                  item.params.content
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