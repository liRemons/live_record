const parseContext = (str, data) => {
  const keys = Object.keys(data);
  const dataList = keys.map(function (key) {
    return data[key];
  });
  for (let i = 0; i < keys.length; i++) {
    str = str.replace(
      new RegExp('\\$\\{' + keys[i] + '\\}', 'gm'),
      dataList[i]
    );
  }
  return str;
};

const encodeURL = (url) => url.replace(/\\/g, '/');

const extname = (url) => {
  const temp = url.split('/');
  const filename = temp[temp.length - 1];
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
};

const isImageFileType = (type) => type.indexOf('image') === 0;

const isImageUrl = (file) => {
  if(!file) {
    return false
  }
  if (file.type) {
    return isImageFileType(file.type);
  }
  const url = (file.thumbUrl || file.url);
  const extension = extname(url);
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
  ) {
    return true;
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  }
  if (extension) {
    // other file types which have extension
    return false;
  }
  return true;
};

module.exports = {
  parseContext,
  encodeURL,
  isImageUrl
}