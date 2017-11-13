import React,{Component} from 'react';
import { Container, Panel } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

class ModuleIconView extends Component{
  state = {
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
            <Container height="100" width="100" style={{}} layout="center">
              <span className={obj.iconCls+" ic_view"} style={{color:obj.iconColor}}></span>
              <div className="text_view">{obj.text}</div>
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
      <div style={{width:'100%',height:'100%'}} className="modules_container">
        <Container layout='auto' padding={10} style={{display:'block'}}>
          {allIconViews}
        </Container>
      </div>
    )
  }


}

export default ModuleIconView;
