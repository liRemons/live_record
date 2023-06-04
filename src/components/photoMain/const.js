import React from "react"
import { Input, Image } from 'antd';

const TextArea = Input.TextArea;


export const typeMap = {
  input: Input,
  img: Image,
  // text: TextArea
}


const typeHandleMap = {
  input: [
    {
      key: '',
      icon: '',
      help: '左局中'
    }
  ]
}