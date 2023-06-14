import React from "react"
export const typeMap = (params) => {
  const { content, style } = params;
  return {
    text: () => <div style={style}>
      <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
    </div>,
    image: () => !content ? null : <div style={style}><img src={content} style={{ height: '100%', width: '100%', objectFit: 'cover' }} /></div>,
  }[params.uiType]?.()
}