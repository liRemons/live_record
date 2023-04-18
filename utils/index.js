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


module.exports = {
  parseContext
}