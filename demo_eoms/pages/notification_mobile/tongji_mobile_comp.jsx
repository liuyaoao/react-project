//统计分析的移动端
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import {Toast,WhiteSpace} from 'antd-mobile';
import echarts from 'echarts';
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

const analysisKey2name_1 = {
  "zcrs":"在册人数",
  "jjrs":"解矫人数",
  "dyrj":"本月入矫",
  "dyjj":"本月解矫",
};
const analysisKey2name_2 = {
  "gz":"管制",
  "hx":"缓刑",
  "js":"假释",
};
const analysisKey2name_3 = {
  "jwzx":"暂予监外执行",
  "bq":"剥夺政治权利",
  "sjdw":"手机定位",
  "bddw":"北斗定位"
};
export default class TongjiMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        organId:'',
        isMobile: Utils.isMobile(),
      };
  }
  getChartOptions = (xAxisData,seriesData)=>{
    return {
          title: {
            x: 'center',
          },
          tooltip: {
              trigger: 'item'
          },
          calculable: true,
          grid: {
              borderWidth: 1,
              y: 80,
              y2: 60
          },
          xAxis: [
              {
                  type: 'category',
                  show: true,
                  data: xAxisData
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  show: true
              }
          ],
          series: [
              {
                  name: '类型数量',
                  type: 'bar',
                  itemStyle: {
                      normal: {
                          color: function(params) {
                              // build a color map as your need.
                              var colorList = [
                                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                 '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                 '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                              ];
                              return colorList[params.dataIndex]
                          },
                          label: {
                              show: true,
                              position: 'top',
                              formatter: '{b}\n{c}'
                          }
                      }
                  },
                  data: seriesData
              }
          ]
        };
  }
  componentWillMount(){
  }
  componentDidMount(){
    this.updateChartData({});
    let curOrganId = this.props.location.query.organId;
    if(curOrganId){
      this.getServerAnalysisData(curOrganId,1);
      this.setState({
        organId:curOrganId,
      });
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps.location.query.organId--:',nextProps.location.query.organId);
    let curOrganId = nextProps.location.query.organId;
    if(curOrganId && curOrganId != this.state.organId){
      this.getServerAnalysisData(curOrganId,1);
      this.setState({
        organId:curOrganId,
      });
    }
  }
  getServerAnalysisData = (organId,currentIndex)=>{
    $.post(`${urlPrefix}/android/manager/getTongJiList.action`,
      {organId:organId},(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        // console.log("矫正系统的获取统计分析的返回---：",res,state);
        if(res.respCode != "0"){
          Toast.info(res.respMsg, 2, null, false);
        }else{
          let valueObj = res.values[0];
          this.setState({ tongjiData:valueObj });
          this.updateChartData(valueObj);
        }
    });
  }
  updateChartData = (valueObj)=>{
    let tongjiData_1 = {};
    let tongjiData_2 = {};
    let tongjiData_3 = {};
    $.each(valueObj,(key,value)=>{
      if(analysisKey2name_1[key]){
        tongjiData_1[analysisKey2name_1[key]] = value || "0";
      }
      if(analysisKey2name_2[key]){
        tongjiData_2[analysisKey2name_2[key]] = value || "0";
      }
      if(analysisKey2name_3[key]){
        tongjiData_3[analysisKey2name_3[key]] = value || "0";
      }
    });
    if(document.getElementById('statisticAnalysis_mobile_1')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_1'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_1),Object.values(tongjiData_1)));
    }
    if(document.getElementById('statisticAnalysis_mobile_2')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_2'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_2),Object.values(tongjiData_2)));
    }
    if(document.getElementById('statisticAnalysis_mobile_3')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_3'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_3),Object.values(tongjiData_3)));
    }
  }

  render(){
    return (
      <div className="statisticAnalysis_mobile_container">
        <div id="statisticAnalysis_mobile_1" style={{height:500,margin:"0 auto",marginTop:10}}></div>
        <div id="statisticAnalysis_mobile_2" style={{height:500,margin:"0 auto",marginTop:10}}></div>
        <div id="statisticAnalysis_mobile_3" style={{height:500,margin:"0 auto",marginTop:10}}></div>
      </div>
    )
  }
}
