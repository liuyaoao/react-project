import React,{Component} from 'react';
import { List } from '@extjs/ext-react';

class SidebarMenu extends Component{
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
  dataStore = {
      data: [
        {index:1, name:' Wireless', class_name:'mif-wifi-connect icon'},
        {index:2, name:' Internet', class_name:'mif-earth icon'}
      ],
      sorters: 'name'
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
  onListSelect = (records,opts)=>{
    console.log("records--opts--:",records,opts);
  }
  itemTpl = (data)=>(<div>
              <a onClick={this.handleShow.bind(this, data.index)}><span className={data.class_name}></span> {data.name}</a>
            </div>)
  render(){

    return (
      <List cls="sidebar2 sidebar3"
            shadow
            itemTpl={this.itemTpl}
            store={this.dataStore}
            onSelect={this.onListSelect}
            zIndex={999}
            platformConfig={{
                '!phone': {
                    height: 450,
                    width: 300
                }
            }}
      />
      // {/*<ul className="sidebar2 sidebar3">
      //   <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-wifi-connect icon"></span> Wireless</a></li>
      //   <li className=""><a onClick={this.handleShow.bind(this, 2)}><span className="mif-earth icon"></span> Internet</a></li>
      //   <li className=""><a><span className="mif-local-service icon"></span> Local Network</a></li>
      //   <li className=""><a><span className="mif-users icon"></span> Parental Control</a></li>
      //   <li className=""><a><span className="mif-equalizer-v icon"></span> Traffic Control</a></li>
      //   <li className=""><a><span className="mif-security icon"></span> Security</a></li>
      //   <li className=""><a><span className="mif-notification icon"></span> Notification</a></li>
      // </ul>*/}
    )
  }


}

export default SidebarMenu;
