//收文管理 -按主办部门查询页。
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WhiteSpace, SwipeAction, List} from 'antd-mobile';
import { Icon} from 'antd';

//收文管理-按主办部门查询页。
class TabPanelByDepartment extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        selectedDepartment:'', //选中的部门。
        organizationMap:{},
        organizationTypes:[], //组织机构类型
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData();
  }
  getServerListData = (=>{
    this.getServerNotionType();
    OAUtils.getOrganization({
      tokenunid:this.props.tokenunid,
      successCall: (data)=>{
        console.log("获取OA的组织机构数据：",data);
        let organizationList = OAUtils.formatOrganizationData(data.values);
        let organizationTypes = this.parseOrgaTypes(organizationList) || [];

        this.setState({
          organizationMap:data.values || {},
          organizationTypes:organizationTypes,

        });
      }
    });

  }
  parseOrgaTypes = (organizationList)=>{
    return organizationList.map((item)=>{
      return {
        label:item.commonname,
        value:item.unid,
      }
    });
  }
  onClickLoadMore = (evt)=>{

  }
  onPickerOkDepartment = (val)=>{ //选择好部门
    this.setState({selectedDepartment:val});
    this.props.chooseDepartmentCall(val);
  }

  render() {


    return (
      <div>
        <div style={{height:'1.5em',background:'#f3eeee'}}></div>
        <List style={{ backgroundColor: 'white' }}>

          <Picker data={this.state.organizationTypes} cols={1} onOk={this.onPickerOkDepartment}>
            <List.Item arrow="horizontal"><Badge size="small" text="2"/>主办部门</List.Item>
          </Picker>

        </List>
      </div>
    )
  }
}

TabPanelByDepartment.defaultProps = {
};
TabPanelByDepartment.propTypes = {
};

export default TabPanelByDepartment;
