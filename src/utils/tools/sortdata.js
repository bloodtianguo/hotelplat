// 升序
export var sortFunallrise = (propertyName, data) => {
  // propertyName为需要排序的key   data为需要排序的数组
  function sortFun(propertyName) {
    return function (object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  data.sort(sortFun(propertyName));
  return data
}
// 使用
// sortFunall("name",data)
// 降序
export var sortFunalldrop = (propertyName, data) => {
  // propertyName为需要排序的key   data为需要排序的数组
  function sortFun(propertyName) {
    return function (object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value1 > value2) {
        return -1;
      } else if (value1 < value2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  data.sort(sortFun(propertyName));
  return data
}
