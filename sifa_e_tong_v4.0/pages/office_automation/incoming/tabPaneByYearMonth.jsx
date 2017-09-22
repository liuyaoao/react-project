//收文管理-按年度查询的页面
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WhiteSpace, SwipeAction, List} from 'antd-mobile';
import { Icon} from 'antd';

//收文管理-按年度查询的页面
class TabPanelByYearMonth extends React.Component {
  constructor(props) {
      super(props);
      let nowDate = new Date();
      this.state = {
        selectedYear:''+nowDate.getFullYear(),
        selectedMonth:''+nowDate.getDate(),
        organizationMap:{},
        yearTypes:[], //组织机构类型
      };
  }
  componentWillMount(){
    let yearArr = [];
    for(let i=1;i<=4;i++){

    }
  }
  getServerListData = ()=>{
    // OAUtils.getOrganization({
    //   tokenunid:this.props.tokenunid,
    //   successCall: (data)=>{
    //     console.log("获取OA的组织机构数据：",data);
    //     let organizationList = OAUtils.formatOrganizationData(data.values);
    //     let organizationTypes = this.parseOrgaTypes(organizationList) || [];
    //
    //     this.setState({
    //       selectedDepartment:'', //选中的部门。
    //       organizationMap:data.values || {},
    //       organizationTypes:organizationTypes,
    //
    //     });
    //   }
    // });

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

          <Picker data={this.state.yearTypes} cols={2} onOk={this.onPickerOkDepartment}>
            <List.Item arrow="horizontal"><Badge size="small" text="2"/>主办部门</List.Item>
          </Picker>

        </List>
      </div>
    )
  }
}

TabPanelByYearMonth.defaultProps = {
};
TabPanelByYearMonth.propTypes = {
};

export default TabPanelByYearMonth;
