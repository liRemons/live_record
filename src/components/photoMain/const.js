import React from "react"
export const typeMap = (params) => {
  const { content, style } = params;
  const { objectFit, ...styleOthers } = style;
  return {
    text: () => <div style={styleOthers}>
      <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
    </div>,
    image: () => !content ? null : <div style={style}><img src={content} style={{ height: '100%', width: '100%', objectFit }} /></div>,
  }[params.uiType]?.()
}