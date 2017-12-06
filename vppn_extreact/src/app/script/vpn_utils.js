

export function parseRouteList(routeList){  //vpn 的remote router 的列表
  let list = [];
  routeList.map((item)=>{
    let tempObj = Object.assign({},item);
    let subnetArr = item.peer_vip.split('.');
    subnetArr[3] = 0;
    tempObj.status = item.peer_latency<=0 ? 0 : 1;
    tempObj.subnet = subnetArr.join('.');
    tempObj.link = item.peer_latency<=0 ? 'Direct' : 'Relayed';
    list.push(tempObj);
  });
  return list;
}

export function parseVPathList(vpaths){ //整理，重新构造vPath列表。
  let list = [];
  vpaths.map((item)=>{
    let tempObj = Object.assign({},item);
    tempObj.desc = "";
    list.push(tempObj);
  });
  return list;
}
export function parseVProxyDropdownList(routeList){
  return routeList.map((item)=>{
    return {text:item.peer_vip,value:item.peer_vip}
  });
}
