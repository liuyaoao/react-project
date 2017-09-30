import $ from 'jquery';
import myWebClient from 'client/my_web_client.jsx';
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';
import OrganizationStore from 'pages/stores/organization_store.jsx';

export function getServerOrganizationsData(){ //从服务端获取组织机构数据
  myWebClient.getOrganizationsData((data,res)=>{
      let objArr = JSON.parse(res.text);
      let flatDataArr = getOrganizationsFlatDataArr(objArr); //平行的object数组结构。
      let flatDataMap = getOrganizationsFlatMap(flatDataArr);
      AppDispatcher.handleServerAction({
          type: "received_new_organizations",
          organizationsData: objArr,
          organizationsFlatData: flatDataArr,
          organizationsFlatDataMap:flatDataMap
      });
      OrganizationStore.setOrgaData(objArr);
      OrganizationStore.setOrgaFlatData(flatDataArr);
      OrganizationStore.setOrgaFlatMap(flatDataMap);
      OrganizationStore.emitOrgaChange();
  }, (e,err,res)=>{
      // notification.error({message:"获取组织结构数据失败了！"});
      // console.log("request server orgnizasitions response error info:", err);
  });
}
export function getOrganizationsFlatDataArr(objArr){ //得到平级的组织结构数据。是一个object数组，去掉了subOrganization字段。
  let flatArr = [];
  $.each(objArr, (index, obj)=>{
    if(!obj.subOrganization || obj.subOrganization.length<=0){ //已经是子节点了。
      flatArr.push({id:obj.id,name:obj.name,organizationLevel:obj.organizationLevel,parentId:obj.parentId,subOrganizationNum:0});
    }else{ //表示还有孩子节点存在。
      flatArr.push({id:obj.id,name:obj.name,organizationLevel:obj.organizationLevel,parentId:obj.parentId,subOrganizationNum:obj.subOrganization.length});
      let childConfig = obj.subOrganization;
      let childrens = getOrganizationsFlatDataArr(childConfig);
      flatArr.push(...childrens); //递归调用
    }
  });
  return flatArr;
}

export function getOrganizationsFlatMap(flatDataArr) {
  let flatDataMap = {};
  $.each(flatDataArr,(index,obj)=>{  //平行的键值对的map结构。
    flatDataMap[obj.id] = obj;
  });
  return flatDataMap;
}

//解析权限的数据
export function getPermissionFlatDataArr(objArr){ //得到平级的权限数据。是一个object数组，去掉了sub字段。
  let flatArr = [];
  $.each(objArr, (index, obj)=>{
    if(!obj.sub || obj.sub.length<=0){ //已经是子节点了。
      flatArr.push(copyPermissionAttrData(obj));
    }else{ //表示还有孩子节点存在。
      let tempObj = copyPermissionAttrData(obj);
      tempObj["subNum"] = obj.sub.length;
      flatArr.push(tempObj);
      let childConfig = obj.sub;
      let childrens = getPermissionFlatDataArr(childConfig);
      flatArr.push(...childrens); //递归调用
    }
  });
  return flatArr;
}
export function copyPermissionAttrData(obj){
  return {
    actions:obj.actions,
    isAvailable:obj.isAvailable,
    organization:obj.organization ||'',
    parentId:obj.parentId,
    resourceId:obj.resourceId,
    resourceName:obj.resourceName,
    resourceType:obj.resourceType,
    permissionId:obj.permissionId||'',
  }
}

export function getPermissionFlatMap(flatDataArr) {
  let flatDataMap = {};
  $.each(flatDataArr,(index,obj)=>{  //平行的键值对的map结构。
    flatDataMap[obj.resourceId] = obj;
  });
  return flatDataMap;
}

//获取通讯录的目录结构数据。
export function getServerContactDirectory(successCallback){ //获取通讯录的目录结构数据。
  myWebClient.getContactDirectoryData((data,res)=>{
      let objArr = JSON.parse(res.text);

      let flatDataArr = getDirectoryFlatDataArr(objArr,''); //平行的object数组结构。
      let flatDataMap = getDirectoryFlatMap(flatDataArr);
      successCallback && successCallback(objArr,flatDataArr,flatDataMap);
      // AppDispatcher.handleServerAction({
      //     type: "received_new_organizations",
      //     organizationsData: objArr,
      //     organizationsFlatData: flatDataArr,
      //     organizationsFlatDataMap:flatDataMap
      // });
  }, (e,err,res)=>{
      // notification.error({message:"获取组织结构数据失败了！"});
      // console.log("request server orgnizasitions response error info:", err);
  });
}

export function getDirectoryFlatDataArr(objArr,parentId){ //得到平级的组织结构数据。是一个object数组，
  let flatArr = [];
  $.each(objArr, (index, obj)=>{
    obj.parentId = parentId;
    obj.id = (obj.name || "123456")+"_"+parentId;
    if(!obj.subtrees || obj.subtrees.length<=0){ //已经是子节点了。
      flatArr.push({id:(obj.name || "123456")+"_"+parentId,parentId:parentId, name:obj.name || "123456",subtreeNum:0});
    }else{ //表示还有孩子节点存在。
      flatArr.push({id:(obj.name || "123456")+"_"+parentId,parentId:parentId, name:obj.name || "123456",subtreeNum:obj.subtrees.length});
      let childConfig = obj.subtrees;
      let childrens = getDirectoryFlatDataArr(childConfig,obj.id);
      flatArr.push(...childrens); //递归调用
    }
  });
  return flatArr;
}
export function getDirectoryFlatMap(flatDataArr) {
  let flatDataMap = {};
  $.each(flatDataArr,(index,obj)=>{  //平行的键值对的map结构。
    flatDataMap[obj.id] = obj;
  });
  return flatDataMap;
}
