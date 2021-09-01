export function switchtypeFin(data) {
  var datas = ""
  switch (data) {
    case 1:
      datas = "待支付";
      break;
    case 2:
      datas = "待确定";
      break;
    case 3:
      datas = "待入住";
      break;
    case 4:
      datas = "已入住";
      break;
    case 5:
      datas = "已完成";
      break;
    case 6:
      datas = "取消中";
      break;
    case 7:
      datas = "已退款";
      break;
    case 8:
      datas = "已取消";
      break;
    case 9:
      datas = "待取消";
      break;
    case 10:
      datas = "待退款";
      break;
    case 11:
      datas = "退款中";
      break;
    default:
      datas = "--";
      break;
  }
  return datas
}
