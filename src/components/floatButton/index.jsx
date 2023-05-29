import React from "react";
import { FloatButton } from "antd";

const View = ({ position = 'fixed', shape = 'circle', fixReference = 'bottom', components = [], ...others }) => {
  return components.map(item => ({ ...item, shape })).map((item, index) => {
    const style = {
      [fixReference]: (index * 60) + 30, position, ...others
    }
    if (position !== 'fixed') {
      console.error('position !== fixed 时， 不支持传入 trigger')
      delete item.trigger;
    }
    if (item.children) {
      const { children = [], ...others } = item;

      return <FloatButton.Group style={style} {...others}>
        {
          children.map(el => <FloatButton {...el} />)
        }
      </FloatButton.Group>
    } else {
      return <FloatButton style={style} {...item} />
    }
  })
}

export default View;