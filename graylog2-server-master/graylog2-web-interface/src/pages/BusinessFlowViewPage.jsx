import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';
import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

require('!script!../../public/javascripts/paper-full.min.js');
import InfoModal from 'components/architecture/infoModal';
var ReactWidgets = require('react-widgets');
var widget = require('./widget.js');
import AppConfig from 'util/AppConfig';

var SERVERADDRESS = AppConfig.gl2ServerUrl();//192.168.54.110:8080    192.168.9.163:8080  192.168.6.18
// console.log('window.appConfig',window.appConfig.gl2ServerUrl);
const BusinessFlowViewPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  getInitialState: function() {
      return {
          initFrom: 1,
          initNumPerPage: 25,
          initCurrentPage: 1,
      }
  },
  getData(){
    var address = SERVERADDRESS+"/business?action=busview&id=&start=1469790857266&end=1469890857266&from=0&to=25";
    $.ajax({
					type: "get",
					async: false,
					url: address,
					dataType: "json",
					cache:false,
					// data: {
					// 	user:user.username,
					// 	passwd:pwd
					// },
					success: function (data) {
            console.log('--',data);
					},
					timeout: 30000,
					error: function (data) {
            console.log('error',data);
					}
				});
  },
  componentDidUpdate(){

  },
  componentWillUnmount(){
    $('#businessNav').attr("class","");
  },
  componentDidMount() {
    // alert(window.appConfig);

    $('#businessNav').attr("class","active");
      this.getData();

      paper.install(window);
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);

      var screenWidth = $(window).width();
      var screenHeight = $(window).height();
      var rectBkWidth = screenWidth*0.8;
      var rectBkHeight = screenHeight*0.5;
      var rectCenter= screenWidth/2-rectBkWidth/2;
      var startPoint = {x:rectCenter,y:20,width:rectBkWidth,height:rectBkHeight};
      var rects ={width:startPoint.width/14,height:startPoint.width/14};

      $('.panelBasic').css({"width":startPoint.width+"px",'margin-left':startPoint.x+'px'});
      // alert(startPoint.width/12);
      //第二个方框
      var rectBackground = new Shape.Rectangle({
          top:startPoint.y,
          left:startPoint.x,
          size: [startPoint.width, startPoint.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });

      var square_1 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*0.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_1 = new PointText({
          point: new Point(square_1.position.x, square_1.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_1 = new PointText({
          point: new Point(square_1.position.x, square_1.position.y + 65),
          content: 'WEB',
          fillColor: 'black',
          justification: 'center'
      });

      var square_2 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*3.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_2 = new PointText({
          point: new Point(square_2.position.x, square_2.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_2 = new PointText({
          point: new Point(square_2.position.x, square_2.position.y + 65),
          content: 'RA',
          fillColor: 'black',
          justification: 'center'
      });

      var square_3 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*5.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_3 = new PointText({
          point: new Point(square_3.position.x, square_3.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_3 = new PointText({
          point: new Point(square_3.position.x, square_3.position.y + 65),
          content: 'CA',
          fillColor: 'black',
          justification: 'center'
      });

      var square_4 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*7.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_4 = new PointText({
          point: new Point(square_4.position.x, square_4.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_4 = new PointText({
          point: new Point(square_4.position.x, square_4.position.y + 65),
          content: 'KM',
          fillColor: 'black',
          justification: 'center'
      });

      var square_5 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*9.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_5 = new PointText({
          point: new Point(square_5.position.x, square_5.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_5 = new PointText({
          point: new Point(square_5.position.x, square_5.position.y + 65),
          content: 'CA',
          fillColor: 'black',
          justification: 'center'
      });

      var square_7 = new Shape.Rectangle({
          top:startPoint.y+rects.width/2,
          left:startPoint.x+rects.height*11.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var content_7 = new PointText({
          point: new Point(square_7.position.x, square_7.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_7 = new PointText({
          point: new Point(square_7.position.x, square_7.position.y + 65),
          content: 'RA',
          fillColor: 'black',
          justification: 'center'
      });

      var square_6 = new Shape.Rectangle({
          top:startPoint.y+rects.width*3,
          left:startPoint.x+rects.height*6.5,
          size: [rects.width, rects.height],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      square_6.rotate(90);
      var content_6 = new PointText({
          point: new Point(square_6.position.x, square_6.position.y),
          fillColor: 'black',
          justification: 'center'
      });
      var title_6 = new PointText({
          point: new Point(square_6.position.x, square_6.position.y + 65),
          content: 'DB',
          fillColor: 'black',
          justification: 'center'
      });


      var LineStart = new Point(startPoint.x+rects.height*0.5+rects.width/2, startPoint.y+rects.width/2);
      var LineEnd = new Point(startPoint.x+rects.height*3.5-rects.width/2, startPoint.y+rects.width/2);
      var LineVector = LineEnd.subtract(LineStart);
      var LineArrow = LineVector.normalize(10);
      var LineVectorItem_1 = new Group([
          new Path([LineStart, LineEnd]),
          new Path([
              LineEnd.add(LineArrow.rotate(150)),
        LineEnd,
        LineEnd.add(LineArrow.rotate(-150))
          ])
      ]);
      LineVectorItem_1.strokeColor = 'red';
      LineVectorItem_1.position.x += rects.width/2;
      LineVectorItem_1.position.y += rects.width/2;
      console.log('线1',LineVectorItem_1);

      var LineStart_2 = new Point(startPoint.x+rects.height*3.5+rects.width/2, startPoint.y+rects.width/2);
      var LineEnd_2 = new Point(startPoint.x+rects.height*5.5-rects.width/2, startPoint.y+rects.width/2);
      var LineVector_2 = LineEnd_2.subtract(LineStart_2);
      var LineArrow_2 = LineVector_2.normalize(10);
      var LineVectorItem_2 = new Group([
          new Path([LineStart_2, LineEnd_2]),
          new Path([
              LineEnd_2.add(LineArrow_2.rotate(150)),
        LineEnd_2,
        LineEnd_2.add(LineArrow_2.rotate(-150))
          ])
      ]);
      LineVectorItem_2.strokeColor = 'red';
      LineVectorItem_2.position.x += rects.width/2;
      LineVectorItem_2.position.y += rects.width/2;

      var LineStart_3 = new Point(startPoint.x+rects.height*5.5+rects.width/2, startPoint.y+rects.width/2);
      var LineEnd_3 = new Point(startPoint.x+rects.height*7.5-rects.width/2, startPoint.y+rects.width/2);
      var LineVector_3 = LineEnd_3.subtract(LineStart_3);
      var LineArrow_3 = LineVector_3.normalize(10);
      var LineVectorItem_3 = new Group([
          new Path([LineStart_3, LineEnd_3]),
          new Path([
              LineEnd_3.add(LineArrow_3.rotate(150)),
        LineEnd_3,
        LineEnd_3.add(LineArrow_3.rotate(-150))
          ])
      ]);
      LineVectorItem_3.strokeColor = 'red';
      LineVectorItem_3.position.x += rects.width/2;
      LineVectorItem_3.position.y += rects.width/2;

      var LineStart_4 = new Point(startPoint.x+rects.height*7.5+rects.width/2, startPoint.y+rects.width/2);
      var LineEnd_4 = new Point(startPoint.x+rects.height*9.5-rects.width/2, startPoint.y+rects.width/2);
      var LineVector_4 = LineEnd_4.subtract(LineStart_4);
      var LineArrow_4 = LineVector_4.normalize(10);
      var LineVectorItem_4 = new Group([
          new Path([LineStart_4, LineEnd_4]),
          new Path([
              LineEnd_4.add(LineArrow_4.rotate(150)),
        LineEnd_4,
        LineEnd_4.add(LineArrow_4.rotate(-150))
          ])
      ]);
      LineVectorItem_4.strokeColor = 'red';
      LineVectorItem_4.position.x += rects.width/2;
      LineVectorItem_4.position.y += rects.width/2;

      var LineStart_5 = new Point(startPoint.x+rects.height*3.5+rects.width/2, startPoint.y+rects.width);
      var LineEnd_5 = new Point(startPoint.x+rects.height*6.5-rects.width/2, startPoint.y+rects.width*3-rects.width/2);
      var LineVector_5 = LineEnd_5.subtract(LineStart_5);
      var LineArrow_5 = LineVector_5.normalize(10);
      var LineVectorItem_5 = new Group([
          new Path([LineStart_5, LineEnd_5]),
          new Path([
              LineEnd_5.add(LineArrow_5.rotate(150)),
        LineEnd_5,
        LineEnd_5.add(LineArrow_5.rotate(-150))
          ])
      ]);
      LineVectorItem_5.strokeColor = 'red';
      LineVectorItem_5.position.x += rects.width/2;
      LineVectorItem_5.position.y += rects.width/2;

      var LineStart_6 = new Point(startPoint.x+rects.height*7.5, startPoint.y+rects.width);
      var LineEnd_6 = new Point(startPoint.x+rects.height*6.5, startPoint.y+rects.width*3-rects.width/2);
      var LineVector_6 = LineEnd_6.subtract(LineStart_6);
      var LineArrow_6 = LineVector_6.normalize(10);
      var LineVectorItem_6 = new Group([
          new Path([LineStart_6, LineEnd_6]),
          new Path([
              LineEnd_6.add(LineArrow_6.rotate(150)),
        LineEnd_6,
        LineEnd_6.add(LineArrow_6.rotate(-150))
          ])
      ]);
      LineVectorItem_6.strokeColor = 'red';
      LineVectorItem_6.position.x += rects.width/2;
      LineVectorItem_6.position.y += rects.width/2;

      var LineStart_7 = new Point(startPoint.x+rects.height*9.5, startPoint.y+rects.width);
      var LineEnd_7 = new Point(startPoint.x+rects.height*6.5+rects.width/2, startPoint.y+rects.width*3-rects.width/2);
      var LineVector_7 = LineEnd_7.subtract(LineStart_7);
      var LineArrow_7 = LineVector_7.normalize(10);
      var LineVectorItem_7 = new Group([
          new Path([LineStart_7, LineEnd_7]),
          new Path([
              LineEnd_7.add(LineArrow_7.rotate(150)),
        LineEnd_7,
        LineEnd_7.add(LineArrow_7.rotate(-150))
          ])
      ]);
      LineVectorItem_7.strokeColor = 'red';
      LineVectorItem_7.position.x += rects.width/2;
      LineVectorItem_7.position.y += rects.width/2;

      console.log('高~~~',square_6.top-square_5.top-rects.height);
      console.log('宽~~~',(startPoint.x+rects.height*6.5)-(startPoint.x+rects.height*3.5));
      var arrowWidth = square_6.top-square_5.top-rects.height;
      var arrowHeight = (startPoint.x+rects.height*6.5)-(startPoint.x+rects.height*3.5);

      // console.log(Math.sqrt( Math.pow(arrowWidth,2) + Math.pow(arrowHeight,2) ));
      //
      // console.log('线条===',LineVectorItem_4);


      var LineStart_8 = new Point(startPoint.x+rects.height*9.5+rects.width/2, startPoint.y+rects.width/2);
      var LineEnd_8 = new Point(startPoint.x+rects.height*11.5-rects.width/2, startPoint.y+rects.width/2);
      var LineVector_8 = LineEnd_8.subtract(LineStart_8);
      var LineArrow_8 = LineVector_8.normalize(10);
      var LineVectorItem_8 = new Group([
          new Path([LineStart_8, LineEnd_8]),
          new Path([
              LineEnd_8.add(LineArrow_8.rotate(150)),
        LineEnd_8,
        LineEnd_8.add(LineArrow_8.rotate(-150))
          ])
      ]);
      LineVectorItem_8.strokeColor = 'red';
      LineVectorItem_8.position.x += rects.width/2;
      LineVectorItem_8.position.y += rects.width/2;

      var LineStart_9 = new Point(startPoint.x+rects.height*9.5+rects.width*2, startPoint.y+rects.width);
      var LineEnd_9 = new Point(startPoint.x+rects.height*6.5+rects.width/2, startPoint.y+rects.width*3);
      var LineVector_9 = LineEnd_9.subtract(LineStart_9);
      var LineArrow_9 = LineVector_9.normalize(10);
      var LineVectorItem_9 = new Group([
          new Path([LineStart_9, LineEnd_9]),
          new Path([
              LineEnd_9.add(LineArrow_9.rotate(150)),
        LineEnd_9,
        LineEnd_9.add(LineArrow_9.rotate(-150))
          ])
      ]);
      LineVectorItem_9.strokeColor = 'red';
      LineVectorItem_9.position.x += rects.width/2;
      LineVectorItem_9.position.y += rects.width/2;


      var t = 0;
      view.onFrame = function(event) {
        //箭头动画
        // LineVectorItem_1.children[1].position.x = LineVectorItem_1.children[0].position.x - rects.width + event.count%180 / 180 * LineVectorItem_1.children[0].length;
        // console.log('x',LineVectorItem_1.children[1].position.x,'位置：',LineVectorItem_1.children[0].position.x,"长度",event.count%180 / 180 * LineVectorItem_1.children[0].length);

        // LineVectorItem_2.children[1].position.x = LineVectorItem_2.children[0].position.x - rects.width/2 + event.count%180 / 180 * LineVectorItem_2.children[0].length;
        // LineVectorItem_3.children[1].position.x = LineVectorItem_3.children[0].position.x - rects.width/2 + event.count%180 / 180 * LineVectorItem_3.children[0].length;
        // LineVectorItem_4.children[1].position.x = LineVectorItem_4.children[0].position.x - rects.width/2 + event.count%180 / 180 * LineVectorItem_4.children[0].length;
        // console.log('event.count==',event.count,LineVectorItem_4);
        // console.log('x = ',LineVectorItem_4.children[0].position.x,'length=',event.count%180 / 180 * LineVectorItem_4.children[0].length,'xxxx=',LineVectorItem_4.children[0].length);

        // LineVectorItem_5.children[1].position.x = LineVectorItem_5.children[0].position.x- rects.width + event.count%180 / 180 * LineVectorItem_5.children[0].length;
        // LineVectorItem_5.children[1].position.y = LineVectorItem_5.children[0].position.y-rects.width/1.5;


          // group_1.children[1].position.x = group_1.children[0].position.x - 80 + event.count%180 / 180 * group_1.children[0].length;
          // group_2.children[1].position.x = group_2.children[0].position.x - 50 + event.count%180 / 180 * group_2.children[0].length;
          // group_3.children[1].position.x = group_3.children[0].position.x - 50 + event.count%180 / 180 * group_3.children[0].length;
          // group_4.children[1].position.x = group_4.children[0].position.x - 50 + event.count%180 / 180 * group_4.children[0].length;
          // group_5.children[1].position.x = group_5.children[0].position.x - 50 + event.count%180 / 180 * group_5.children[0].length;
          // group_6.children[1].position.y = group_6.children[0].position.y - 50 + event.count%180 / 180 * group_6.children[0].length;
          // group_7.children[1].position.x = group_7.children[0].position.x + 150 - event.count%540 / 540 * group_7.children[0].length;
          // vectorItem_8.children[1].position.x = vectorItem_8.children[0].position.x + 50 - event.count%180 / 180 * vectorItem_8.children[0].length;
          //
          //
          // square_2.radius = Math.abs(Math.sin(event.count / 40)) * 40;
          // square_4.rotate(2);
          //
          // rectangle_1.strokeWidth = Math.abs(Math.sin(event.count / 40)) * 3;

          // rectangle_3.fillColor.hue += 1;
          // rectangle_4.fillColor = '#00CC33';
          // rectangle_4.fillColor.alpha = 0.8*Math.abs(Math.sin(event.count / 40)) + 0.2;
          // rectangle_5.fillColor.hue += 2;
          //
          square_1.rotate(2);
          square_2.strokeColor.hue += 1;
          square_2.strokeWidth = Math.abs(Math.sin(event.count / 40)) * 3;
          square_3.radius = Math.abs(Math.sin(event.count / 40)) * 40;
          square_4.radius = Math.abs(Math.sin(event.count / 40)) * 40;
          square_6.fillColor = '#00CC33';
          square_6.fillColor.alpha = 0.8*Math.abs(Math.sin(event.count / 40)) + 0.2;
          square_7.fillColor.hue += 2;
          if(t%60 == 0) {
              content_1.content = '输出:' + parseInt(Math.random()*20) + '条/秒';
              content_2.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              content_3.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              content_4.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              // content_1.content = 'Ping:' + parseInt(Math.random()*200+800) + 'KB/s';
              content_5.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              content_6.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              content_7.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              // content_1.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n';
          }
          t++;
      }

      view.draw();



      $('#conditionSearchTable').bootstrapTable({
          columns: [
              {
                  field: 'state',
                  checkbox: true
              },
              {
                  title: '字段',
                  field: 'searchName',
                  // width: 120,
                  sortable: false
              }, {
                  title: '条件',
                  field: 'searchCondition',
                  // width: 150,
                  sortable: false
                  // formatter: durationFormatter
              }, {
                  title: '值',
                  field: 'value',
                  // width: 150,
                  sortable: false
              }
          ],
          data: []
      });
  },
  toDetailPage(){
    alert();
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    var columns = [
    {
        field: 'state',
        checkbox: true,
    }, {
        title: '组名',
        field: 'GROUPNAME',
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: '设备名称',
        field: 'NAME',
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: 'IP地址',
        field: 'IP',
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: '绑定状态',
        sortable: true,
        // formatter: bindStateFormatter,
        halign: 'left',
        align: 'left',
        visible: false
    }, {
        field: 'GBCODE',
        visible: false
    }, {
        field: 'EQUIPMENTTYPE',
        visible: false
    }];
    return (
      <div>
        <InfoModal/>
        <PageHeader title="业务流程图">
          <span>业务流程图展示。</span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <div className="form-inline panelBasic" role="form">
              <div className="form-group">
                <span style={{fontSize:'16px'}}>条件: </span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                  <ReactWidgets.DateTimePicker format={"yyyy-MM-dd HH:mm:ss"} id="slaCreateTime" defaultValue={new Date()}/>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <span style={{fontSize:'16px'}}>业务总数: </span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                  <span style={{fontSize:'16px'}}>1005</span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <span style={{fontSize:'16px'}}>错误记录: </span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <LinkContainer to={Routes.BUSINESSFLOWDETAILVIEW}>
                  <a href="javascript:void(0)" style={{fontSize:'16px'}} >查看业务错误详情</a>
                </LinkContainer>

              </div>
            </div>
            <div style={{width:"100%", height:"500px", backgroundColor:"white"}}>
              <canvas id="canvas" style={{width:"100%", height:"100%", backgroundColor:"white"}}></canvas>
            </div>
            <div className="panelBasic">
              错误日志
              <table id="conditionSearchTable"
                     data-toggle="table"
                     data-classes="table table-striped table-hover"
                     data-height="380"
                     data-toolbar="#toolbar">
              </table>
            </div>
          </Col>
          {/**
          <Col md={6}>
            <div className="business-log">webpack: bundle is now VALID.</div>
          </Col>*/}
          <div className="panelBasic">
          <widget.PaginationTable
                        initFrom={this.state.initFrom}
                        initNumPerPage={this.state.initNumPerPage}
                        initCurrentPage={this.state.initCurrentPage}
                        columns={columns}
                        list={this.props.DevList}
                        id={"deviceTable"}
                        count={1000}
                        onClickRow={this.onClickRow}
                        onClickSort={this.onClickSort}
                        onClickRefresh={this.onClickRefresh}
                        request={this._request} />
                    </div>
        </Row>
      </div>
    );
  },
});

export default BusinessFlowViewPage;
