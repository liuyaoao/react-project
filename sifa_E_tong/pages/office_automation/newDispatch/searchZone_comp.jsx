import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { createForm } from 'rc-form';
import { Modal,WhiteSpace, SwipeAction, Flex,Button,
  Tabs, RefreshControl, ListView,SearchBar,Picker,
  List,NavBar,DatePicker,InputItem} from 'antd-mobile';
import { Icon} from 'antd';
import moment from 'moment';
//查询区组件
class SearchZoneComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        beginTime:null,
        endTime:null,
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextState){
  }
  onBeginTimeChange = (beginTime) => { //开始日期
    this.setState({
      beginTime,
    });
  }
  onEndTimeChange = (endTime) => { //结束日期
    this.setState({
      endTime,
    });
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const year = [{label: '2014 ',value: '2014 '},{label: '2015 ',value: '2015 '},{label: '2016 ',value: '2016 '},
    {label: '2017 ',value: '2017 '},{label: '2018 ',value: '2018 '},{label: '2019 ',value: '2019 '}];
    const month = [{label: '1 ',value: '1 '},{label: '2 ',value: '2 '},{label: '3 ',value: '3 '},
    {label: '4 ',value: '4 '},{label: '5 ',value: '5 '},{label: '6 ',value: '6 '},{label: '7 ',value: '7 '},
    {label: '8 ',value: '8 '},{label: '9 ',value: '9 '},{label: '10 ',value: '10 '},{label: '11 ',value: '11 '},
    {label: '12 ',value: '12 '}];

    let sponsorDepartment = [];
    for(var i=0;i<=this.props.departmentSource.length-1;i++){
      sponsorDepartment.push({
        label:this.props.departmentSource[i],
        value: this.props.departmentSource[i]
      });
    }
    let yearMonthSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div style={{borderBottom: '1px solid #ddd'}}>
                <Picker data={year} cols={1}
                  {...getFieldProps('year')}>
                  <List.Item arrow="horizontal">年份</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={month} cols={1}
                  {...getFieldProps('month')}>
                  <List.Item arrow="horizontal">月份</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={sponsorDepartment} cols={1}
                  {...getFieldProps('sponsorDepartment')}>
                  <List.Item arrow="horizontal">按主办部门</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
    let combinationSearch=(
          <div className={'oa_detail_cnt'}>
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={2} placeholder="标题">标题</InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={4} placeholder="拟稿单位">拟稿单位</InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={4} placeholder="发文文号">发文文号
                        </InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onBeginTimeChange}
                        value={this.state.beginTime}
                      >
                      <List.Item arrow="horizontal">成文起始日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onEndTimeChange}
                        value={this.state.endTime}
                      >
                      <List.Item arrow="horizontal">成文结束日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
              </div>
                <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'90%',marginBottom:'0.1rem'}}
                ><Icon type="search" />查询</Button>
            </div>
    );
    let searchEle=null;
    switch(this.props.tabName){
      case "按日期":
      case "按年度":
        searchEle = yearMonthSource;
        break;
      case "按主办部门":
        searchEle = sponsorDepartmentSource;
        break;
      case "组合查询":
        searchEle = combinationSearch;
        break;
      default:
        break;
    }
    return (
      <div>
        {searchEle}
      </div>
    )
  }
}

SearchZoneComp.defaultProps = {
};
SearchZoneComp.propTypes = {
};

export default createForm()(SearchZoneComp);
