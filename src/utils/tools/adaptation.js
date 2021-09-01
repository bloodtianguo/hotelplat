//适配方案 测试 本项目未投入使用
window.onresize = function () {
  detectOrient();
};
window.onload = function () {
  detectOrient();
};

function detectOrient () {
  var width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight,
    $wrapper = document.getElementById("vue"),
    //  $wrapper = document.getElementsByTagName("body")[0],
    style = "";
  styleTran = "";
  if (width <= height) { // 竖屏
    style = "";
    style += "width:" + width + "px;"; // 注意旋转后的宽高切换
    style += "height:" + height + "px;";
    style += "-webkit-transform: rotate(0); transform: rotate(0);";
    style += "-webkit-transform-origin: 0 0;";
    style += "transform-origin: 0 0;";
    $wrapper.style.cssText = style;
    var html_doc = document.getElementsByTagName("html")[0];
    html_doc.style.cssText = "font-size:" + (width * 100 / 1125) + "px";
    document.getElementsByTagName("html")[0].style.fontSize = width / 7.5 + "px";  //rem适配
  } else { // 横屏
    style = "";
    style += "width:" + height + "px;";
    style += "min-height:" + width + "px;";
    style += "-webkit-transform: rotate(-90deg); transform: rotate(-90deg);";
    // 注意旋转中点的处理
    style += "-webkit-transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
    style += "transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
    var html_doc = document.getElementsByTagName("html")[0];
    html_doc.style.cssText = "font-size:" + height * 100 / 1125 + "px;" + "overflow-y:" + "hidden;" + "height:" + height + "px;";
    style += "overflow-y: hidden;";
    $wrapper.style.cssText = style;
    document.getElementsByTagName("html")[0].style.fontSize = height / 7.5 + "px"; //rem适配
  }
}
