import React,{Component} from 'react';
import { Container, Panel } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';
import Intl from '../../intl/Intl';

class VlanModuleIconView extends Component{
    state = {
      modulesData : {
        root: {
            children: [ //这里的id要和侧边栏的数据的id要对应
                { id: '1_vport', text: 'vPort', iconCls: 'mif-list2 icon', leaf: true, iconColor:'#3db10f' },
                { id: '6_diagnosis', text: 'Diagnosis', iconCls: 'mif-tools icon', leaf: true ,iconColor:'#0f74b1'},
                { id: '7_setting', text: 'Setting', iconCls: 'x-fa fa-gear icon', leaf: true, iconColor:'#6f48e2' },
            ]
        }
      },
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
          <Panel key={index} layout="center" cls="module_icon" style={{margin:'10px',cursor:'pointer',background:'none','float':'left'}}>
            <div onClick={()=>{this.onClickIcon(obj)}}>
              <Container height="100px" width="100px" style={{}} layout="center">
                <span className={obj.iconCls+" ic_view"} style={{color:obj.iconColor}}></span>
                <div className="text_view">{ Intl.get(obj.text,obj.text,{}) }</div>
              </Container>
              </div>
          </Panel>
        );
      });
    }
    render(){
      let {modulesData} = this.state;
      let allIconViews = this.getAllIconViews(modulesData);
      return (
        <div style={{width:'100%',height:'100%'}} className="modules_container">
          <Container layout='auto' padding={10} style={{display:'block'}}>
            {allIconViews}
          </Container>
        </div>
      )
    }


}

export default VlanModuleIconView;
