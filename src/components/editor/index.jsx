import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect, memo } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'

const View = ({ onChange: onPropsChange, content }) => {
  // editor 实例
  const [editor, setEditor] = useState(null)

  // 编辑器内容
  const [html, setHtml] = useState(null)

  useEffect(() => {
      content &&  setHtml(content);
  }, [])

  // 工具栏配置
  const toolbarConfig = {
    excludeKeys: [
      'codeBlock',
      'group-video',
      'group-image',
      'code'
    ]
  }                        // JS 语法

  // 编辑器配置
  const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => {
            setHtml(editor.getHtml())
            onPropsChange && onPropsChange(editor.getHtml(), editor.getText())
          }}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </>
  )
}

export default memo(View)