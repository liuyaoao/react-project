import React,{Component} from 'react';
import { TreeList, List } from '@extjs/ext-react';
import { medium, large } from '../../../responsiveFormulas';

Ext.require('Ext.data.TreeStore');
// Ext.require('Ext.data.Store');

class NetworkSidebar extends Component{
  state = {
    // dataStore:null
  }

  // dataStore = new Ext.data.Store({
  //     data: [
  //       {index:1, name:' Wireless', class_name:'mif-wifi-connect icon'},
  //       {index:2, name:' Internet', class_name:'mif-earth icon'}
  //     ],
  //     sorters: 'name'
  // })
  treeListData = {
    root: {
        children: [
            { id: '1', text: 'Wireless', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: '2', text: 'Internet', iconCls: 'mif-earth icon', leaf: true },
            { id: '3', text: 'Local Network', iconCls: 'mif-local-service icon', leaf: true },
            { id: '4', text: 'Parental Control', iconCls: 'mif-users icon', leaf: true },
            { id: '5', text: 'Traffic Control', iconCls: 'mif-equalizer-v icon', leaf: true },
            { id: '6', text: 'Security', iconCls: 'mif-security icon', leaf: true },
            { id: '7', text: 'Notification', iconCls: 'mif-notification icon', leaf: true },
        ]
    }
  }

  componentWillMount(){
    // this.setState({dataStore});
  }

  handleShow(key, e){

    $('#networkWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#networkWindow .sidebar3 li').each(function(){
      $(this).removeClass('active');
    })
    $(e.target.parentNode).addClass('active');
    $('#networkWindow #wi_right_' + key).addClass('active');
    switch (key) {
      case 1:
        this.props.getWifiSettingsInfo();
        this.props.getWifiSettingsWPASecurityKeys();
        break;
      default:
        break;
    }
  }
  // onListSelect = (records,opts)=>{
  //   console.log("records--opts--:",records,opts);
  // }
  onItemClick = (id)=>{
    console.log("onItemClick--:",id);
    $('#networkWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#networkWindow #wi_right_' + id).addClass('active');
    switch (id) {
      case 1:
        this.props.getWifiSettingsInfo();
        this.props.getWifiSettingsWPASecurityKeys();
        break;
      default:
        break;
    }
  }
  // itemTpl = (data)=>(<div>
  //             <a onClick={this.handleShow.bind(this, data.index)}><span className={data.class_name}></span> {data.name}</a>
  //           </div>)
  render(){

    return (
      // <List cls="sidebar2 sidebar3"
      //       shadow
      //       itemTpl={name}
      //       store={this.dataStore}
      //       onSelect={this.onListSelect}
      //       zIndex={999}
      //       platformConfig={{
      //           '!phone': {
      //               height: 450,
      //               width: 300
      //           }
      //       }}
      // />
      <TreeList cls="sidebar3 ext_treeList_container"
            ui="nav"
            expanderFirst={false}
            onItemClick={(tree, item) => this.onItemClick(item.node.getId())}
            selection={'1'}
            store={this.treeListData}
            responsiveConfig={{
                [medium]: {
                    micro: true,
                    width: 56
                },
                [large]: {
                    micro: false,
                    width: 200
                }
            }}
        />
      // <ul className="sidebar2 sidebar3">
      //   <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-wifi-connect icon"></span> Wireless</a></li>
      //   <li className=""><a onClick={this.handleShow.bind(this, 2)}><span className="mif-earth icon"></span> Internet</a></li>
      //   <li className=""><a><span className="mif-local-service icon"></span> Local Network</a></li>
      //   <li className=""><a><span className="mif-users icon"></span> Parental Control</a></li>
      //   <li className=""><a><span className="mif-equalizer-v icon"></span> Traffic Control</a></li>
      //   <li className=""><a><span className="mif-security icon"></span> Security</a></li>
      //   <li className=""><a><span className="mif-notification icon"></span> Notification</a></li>
      // </ul>
    )
  }


}

export default NetworkSidebar;
