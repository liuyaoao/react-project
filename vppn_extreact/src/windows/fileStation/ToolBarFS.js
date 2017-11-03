import React,{Component} from 'react';
import { Container,Button,Menu,MenuItem } from '@extjs/ext-react';

class ToolBarFS extends Component{
  state={
    newAddType:'newFolder',
    operaType:'text',
    toolType:'tool_1',
  }
  componentDidMount(){

  }
  onNewAddTypeChange = (evt)=>{
    this.setState({
      newAddType:evt.value
    });
  }
  onOperaTypeChange = (evt)=>{
    // console.log("onOperaTypeChange----:",evt);
    this.setState({
      operaType:evt.value
    });
  }
  onToolTypeChange = (evt)=>{
    this.setState({
      toolType:evt.value
    });
  }

  render(){
    let {operaType,toolType, newAddType } = this.state;
    return (
      <div style={{'clear':'both',margin:'10px 10px',width:'100%'}}>
        <div style={{'float':'left'}}>
          <Container>
            <Button cls='' text="上传" ui={'confirm raised'}></Button>
            <Button cls='' text="新增" ui={'confirm raised'} >
              <Menu defaults={{ handler: this.onNewAddTypeChange, group: 'buttontype' }}>
                  <MenuItem text="新建文件夹" value="newFolder"
                    iconCls={newAddType === 'newFolder' ? 'x-font-icon md-icon-check' : 'x-fa fa-folder'}/>
                  <MenuItem text="新增共享文件夹" value="newShareFolder"
                    iconCls={newAddType === 'newShareFolder' ? 'x-font-icon md-icon-check' : 'x-fa fa-folder-open'}/>
              </Menu>
            </Button>
            <Button cls='' text="操作" ui={'confirm raised'}>
              <Menu defaults={{ handler: this.onOperaTypeChange, group: 'buttontype' }}>
                  <MenuItem text="Text" value="text" iconCls={operaType === 'text' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="Icon" value="icon" iconCls={operaType === 'icon' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="Text & Icon" value="texticon" iconCls={operaType === 'texticon' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>
            <Button cls='' text="工具" ui={'confirm raised'}>
              <Menu defaults={{ handler: this.onToolTypeChange, group: 'buttontype' }}>
                  <MenuItem text="共享链路管理器" value="tool_1"
                    iconCls={toolType === 'tool_1' ? 'x-font-icon md-icon-check' : 'x-fa fa-share-alt'}/>
              </Menu>
            </Button>
            <Button cls='' text="设置" ui={'confirm raised'} ></Button>
          </Container>
        </div>
        <div style={{'float':'right'}}>
          <Container>
            <Button cls='' text=' ' ui={'confirm raised'} iconCls={'x-fa fa-th-list'}>
              <Menu defaults={{ handler: this.onOperaTypeChange, group: 'buttontype' }}>
                  <MenuItem text="列表视图" value="列表视图" iconCls={operaType === '列表视图' ? 'x-font-icon md-icon-check' : 'x-fa fa-list'}/>
                  <MenuItem text="小" value="小" iconCls={operaType === '小' ? 'x-font-icon md-icon-check' : 'x-fa fa-th'}/>
                  <MenuItem text="中" value="中" iconCls={operaType === '中' ? 'x-font-icon md-icon-check' : 'x-fa fa-th-large'}/>
                  <MenuItem text="大" value="大" iconCls={operaType === '大' ? 'x-font-icon md-icon-check' : 'x-fa fa-window-maximize'}/>
              </Menu>
            </Button>
            <Button cls='' text=' ' ui={'confirm raised'} iconCls={'x-fa fa-sort-amount-asc'}>
              <Menu defaults={{ handler: this.onOperaTypeChange, group: 'buttontype' }}>
                  <MenuItem text="名称" value="名称" iconCls={operaType === '名称' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="大小" value="大小" iconCls={operaType === '大小' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="文件类型" value="文件类型" iconCls={operaType === '文件类型' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="修改日期" value="修改日期" iconCls={operaType === '修改日期' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="创建日期" value="创建日期" iconCls={operaType === '创建日期' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="最近访问时间" value="最近访问时间" iconCls={operaType === '最近访问时间' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="权限" value="权限" iconCls={operaType === '权限' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="拥有者" value="拥有者" iconCls={operaType === '拥有者' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="群组" value="群组" iconCls={operaType === '群组' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>
          </Container>
        </div>

      </div>
    );
  }

}

export default ToolBarFS;
