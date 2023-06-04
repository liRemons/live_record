import React, { Fragment, useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { message, Popover, Segmented, InputNumber, ColorPicker } from 'antd';
import { typeMap } from './const';

import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  UnderlineOutlined,
  CloseCircleOutlined,
  ItalicOutlined,
  SettingOutlined
} from '@ant-design/icons';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import style from './index.module.less';

const ReactGridLayout = WidthProvider(RGL);


const View = (props) => {
  const [layout, setLayout] = useState([])
  const [isDraggable, setIsDraggable] = useState(true)

  useEffect(() => {
    const layout = [
      { i: "a", x: 0, y: 0, w: 2, h: 2, type: 'input' },
      { i: "b", x: 2, y: 0, w: 11, h: 2, type: 'img' },
      { i: "c", x: 4, y: 0, w: 2, h: 2, type: 'img' }
    ].map(item => ({ ...item, minW: 2, minH: 2, resizeHandles: ['se', 'ne'] }));
    setLayout(layout)
  }, [])

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
        dataSource.map(item => <div className={style.handleItem}>
          <span className={style.label}>{item.label}</span>
          {uiTypeMap[item.uiType]?.(item) || item.render(item)}
        </div>)
      }
    </Fragment>
  }


  const renderTextPopver = () => {
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
        label: '字体宽度',
        options: [100, 200, 300, 400, 500, 600, 700, 800]
      },
      {
        uiType: 'segmented',
        label: '下划线',
        options: [
          {
            value: 'List',
            icon: <UnderlineOutlined />
          },
          'OFF'
        ]
      },
      {
        uiType: 'segmented',
        label: '斜体',
        options: [
          {
            value: 'List',
            icon: <ItalicOutlined />
          },
          'OFF'
        ]
      },
      {
        label: '字体大小',
        render: () => <InputNumber min={12} defaultValue={14} />
      },
      {
        label: '行高',
        render: () => <InputNumber min={12} defaultValue={14} />
      },
      {
        label: '字体间距',
        render: () => <InputNumber min={0} defaultValue={2} />
      },
      {
        label: '字体颜色',
        render: () => <ColorPicker />
      },
    ]
    return <Popover arrow={false} onOpenChange={onOpenChange} content={<div className={style.popover}>
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
      setLayout(newLayout)
    }
  }

  const onOpenChange = (value) => {
    setIsDraggable(!value)
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
      isBounded
      onLayoutChange={onLayoutChange}
    >
      {
        layout.map(item => {
          return <div key={item.i} data-grid={item}>
            <Popover arrow={false} content={
              renderTextPopver()
            }>
              <div className={style.content}>
              </div>
            </Popover>
          </div>
        })
      }
    </ReactGridLayout>
  );
}


export default View;