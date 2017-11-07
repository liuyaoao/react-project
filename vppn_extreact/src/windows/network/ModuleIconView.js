import React,{Component} from 'react';
import { Container, Panel } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

class ModuleIconView extends Component{
  state = {
  }
  treeListData = {
    root: {
        children: [
            { id: 'state_1', text: '状态', iconCls: 'mif-meter icon', leaf: true },
            { id: 'wireless_2', text: '无线', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: 'Internet_3', text: '互联网', iconCls: 'mif-earth icon', leaf: true },
            { id: 'localNetwork_4', text: '本地网络', iconCls: 'mif-home icon', leaf: true },
            { id: 'parentalCtrl_5 ', text: '家长控制', iconCls: 'mif-users icon', leaf: true },
            { id: 'flowCtrl_6', text: '流量控制', iconCls: 'mif-equalizer-v icon', leaf: true },
            { id: 'security_7', text: '安全性', iconCls: 'mif-security icon', leaf: true },
            { id: 'noticeSettings_8', text: '通知设置', iconCls: 'mif-mail-read icon', leaf: true },
            { id: 'management_9', text: '管理', iconCls: 'mif-tools icon', leaf: true },
        ]
    }
  }
  componentWillMount(){
  }
  onClickIcon = (item)=>{
    this.props.onSelectedModule(item.id);
  }
  getAllIconViews = (modulesData)=>{
    let datas = modulesData.root.children || [];
    return datas.map((obj,index)=>{
      return (
        <Panel key={index} layout="center" flex={1} shadow style={{margin:'10px'}}>
          <div onClick={()=>{this.onClickIcon(obj)}}>
            <Container height="100" width="100" style={{paddingRight:'10px'}} layout="center">
              <span style={{display:'block',width:'90%',margin:'10px auto',fontSize:'40px',color:'#48b7e2'}} className={obj.iconCls}></span>
              <div>{obj.text}</div>
            </Container>
            </div>
        </Panel>
      );
    });
  }
  render(){
    let {modulesData} = this.props;
    let allIconViews = this.getAllIconViews(modulesData);
    return (
      <div style={{width:'100%',height:'100%'}}>
        <Container layout={{type:'hbox',pack:'left',align:'top'}} padding={10}>
          {allIconViews}
        </Container>
      </div>
    )
  }


}

export default ModuleIconView;
