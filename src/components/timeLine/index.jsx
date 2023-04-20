import React from 'react';
import { Steps } from 'antd'


function View({ date }) {
  return <>
    <Steps
      progressDot
      current={1}
      direction="vertical"
      items={[
        {
          title: date,
          description: 'This is a description. This is a description.',
        },
        {
          title: date,
          description: 'This is a description. This is a description.',
        },
      ]}
    />
  </>
}

export default View;