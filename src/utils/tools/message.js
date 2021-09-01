import ElementUI from 'element-ui';
export var Success = (message) => {
    ElementUI.Message({
        type: 'success',
        message: message
    });
}
export var Infos = (message) => {
    ElementUI.Message({
        type: 'info',
        message: message
    });
}
export var Warning = (message) => {
  ElementUI.Message({
      type: 'warning',
      message: message
  });
}
