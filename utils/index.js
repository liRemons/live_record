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

const encodeURL = (url) => url.replace(/\\/g, '/')


module.exports = {
  parseContext,
  encodeURL
}