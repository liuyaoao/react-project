import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

require('!script!../../public/javascripts/paper-full.min.js');
import InfoModal from 'components/architecture/infoModal';

const ArchitectureDiagramPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  componentDidMount() {
      paper.install(window);
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);

      var square_1 = new Shape.Rectangle({
          center: [100, 100],
          size: [80, 80],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      var title_1 = new PointText({
          point: new Point(square_1.position.x, square_1.position.y + 65),
          content: '终端',
          fillColor: 'black',
          justification: 'center'
      });
      var info_1 = new PointText({
          point: new Point(square_1.position.x, square_1.position.y),
        //   content: '终端信息',
          fillColor: 'black',
          justification: 'center'
      });
      square_1.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_1.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorStart = new Point(100, 100);
      var end = new Point(200, 100);
      var vector = end.subtract(vectorStart);
      var arrowVector = vector.normalize(10);
      var vectorItem_1 = new Group([
          new Path([vectorStart, end]),
          new Path([
              end.add(arrowVector.rotate(150)),
  			end,
  			end.add(arrowVector.rotate(-150))
          ])
      ]);
      vectorItem_1.strokeColor = 'red';
      vectorItem_1.position.x += 40;

      var rectangle_1 = new Shape.Rectangle({
          center: [100, 100],
          size: [80, 100],
          fillColor: '#ADFDC1',
          strokeColor: '#00B724'
      });
      rectangle_1.position.x += 180;
      var title_2 = new PointText({
          point: new Point(rectangle_1.position.x, rectangle_1.position.y + 65),
          content: '深信服流控',
          fillColor: 'black',
          justification: 'center'
      });
      var info_2 = new PointText({
          point: new Point(rectangle_1.position.x, rectangle_1.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      rectangle_1.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_2.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_2 = vectorItem_1.clone();
      vectorItem_2.position.x += 180;

      var square_2 = square_1.clone();
      square_2.position.x += 360;
      square_2.fillColor = '#00CC33';
      var title_3 = new PointText({
          point: new Point(square_2.position.x, square_2.position.y + 65),
          content: 'IPS绿盟',
          fillColor: 'black',
          justification: 'center'
      });
      var info_3 = new PointText({
          point: new Point(square_2.position.x, square_2.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      square_2.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_3.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_3 = vectorItem_1.clone();
      vectorItem_3.position.x += 360;

      var square_3 = square_1.clone();
      square_3.position.x += 540;
      square_3.radius = 20;
      var title_4 = new PointText({
          point: new Point(square_3.position.x, square_3.position.y + 65),
          content: '深信服FW',
          fillColor: 'black',
          justification: 'center'
      });
      var info_4 = new PointText({
          point: new Point(square_3.position.x, square_3.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      square_3.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_4.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_4 = vectorItem_1.clone();
      vectorItem_4.position.x += 540;

      var rectangle_2 = rectangle_1.clone();
      rectangle_2.rotate(90);
      rectangle_2.position.x += 550;
      var title_5 = new PointText({
          point: new Point(rectangle_2.position.x, rectangle_2.position.y + 65),
          content: '华为路由器',
          fillColor: 'black',
          justification: 'center'
      });
      var info_5 = new PointText({
          point: new Point(rectangle_2.position.x, rectangle_2.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      rectangle_2.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_5.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_5 = vectorItem_1.clone();
      vectorItem_5.position.x += 740;

      var rectangle_3 = rectangle_1.clone();
      rectangle_3.position.x += 740;
      var title_6 = new PointText({
          point: new Point(rectangle_3.position.x, rectangle_3.position.y + 65),
          content: 'RA web server',
          fillColor: 'black',
          justification: 'center'
      });
      var info_6 = new PointText({
          point: new Point(rectangle_3.position.x, rectangle_3.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      rectangle_3.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_6.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_6 = vectorItem_1.clone();
      vectorItem_6.rotate(90);
      vectorItem_6.position.x += 830;
      vectorItem_6.position.y += 125;

      var rectangle_4 = rectangle_1.clone();
      rectangle_4.position.x += 740;
      rectangle_4.position.y += 250;
      rectangle_4.radius = 15;
      var title_7 = new PointText({
          point: new Point(rectangle_4.position.x, rectangle_4.position.y + 65),
          content: 'RA server',
          fillColor: 'black',
          justification: 'center'
      });
      var info_7 = new PointText({
          point: new Point(rectangle_4.position.x, rectangle_4.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      rectangle_4.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_7.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_7 = vectorItem_1.clone();
      vectorItem_7.rotate(180);
      vectorItem_7.children[0].scale(3, 1, new Point(vectorItem_1.children[0].position.x-50, vectorItem_1.children[0].position.y));
      vectorItem_7.position.x += 540;
      vectorItem_7.position.y += 250;

      var square_4 = square_1.clone();
      square_4.position.x += 540;
      square_4.position.y += 250;
      var title_8 = new PointText({
          point: new Point(square_4.position.x, square_4.position.y + 65),
          content: 'CA',
          fillColor: 'black',
          justification: 'center'
      });
      var info_8 = new PointText({
          point: new Point(square_4.position.x, square_4.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      square_4.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_8.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var vectorItem_8 = vectorItem_1.clone();
      vectorItem_8.rotate(180);
      vectorItem_8.position.x += 360;
      vectorItem_8.position.y += 250;

      var rectangle_5 = rectangle_1.clone();
      rectangle_5.position.x += 180;
      rectangle_5.position.y += 250;
      var title_9 = new PointText({
          point: new Point(rectangle_5.position.x, rectangle_5.position.y + 65),
          content: 'KM server',
          fillColor: 'black',
          justification: 'center'
      });
      var info_9 = new PointText({
          point: new Point(rectangle_5.position.x, rectangle_5.position.y),
          content: '监测信息：test',
          fillColor: 'black',
          justification: 'center'
      });
      rectangle_5.onClick = function(event) {
          $('#infoModal').modal('show');
      }
      info_9.onClick = function(event) {
          $('#infoModal').modal('show');
      }

      var t = 0;
      view.onFrame = function(event) {
          vectorItem_1.children[1].position.x = vectorItem_1.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_1.children[0].length;
          vectorItem_2.children[1].position.x = vectorItem_2.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_2.children[0].length;
          vectorItem_3.children[1].position.x = vectorItem_3.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_3.children[0].length;
          vectorItem_4.children[1].position.x = vectorItem_4.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_4.children[0].length;
          vectorItem_5.children[1].position.x = vectorItem_5.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_5.children[0].length;
          vectorItem_6.children[1].position.y = vectorItem_6.children[0].position.y - 50 + event.count%180 / 180 * vectorItem_6.children[0].length;
          // vectorItem_7.children[1].position.x = vectorItem_7.children[0].position.x + 150 - event.count%540 / 540 * vectorItem_7.children[0].length;
          vectorItem_8.children[1].position.x = vectorItem_8.children[0].position.x + 50 - event.count%180 / 180 * vectorItem_8.children[0].length;


          square_2.radius = Math.abs(Math.sin(event.count / 40)) * 40;
          square_4.rotate(2);

          rectangle_1.strokeWidth = Math.abs(Math.sin(event.count / 40)) * 3;
          rectangle_2.strokeColor.hue += 1;
          rectangle_2.strokeWidth = Math.abs(Math.sin(event.count / 40)) * 3;
          rectangle_3.fillColor.hue += 1;
          rectangle_4.fillColor = '#00CC33';
          rectangle_4.fillColor.alpha = 0.8*Math.abs(Math.sin(event.count / 40)) + 0.2;
          rectangle_5.fillColor.hue += 2;

          if(t%60 == 0) {
              info_1.content = '输出:' + parseInt(Math.random()*20) + '条/秒';
              info_2.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_3.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_4.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_5.content = 'Ping:' + parseInt(Math.random()*200+800) + 'KB/s';
              info_6.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_7.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_8.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n' + '输出:' + parseInt(Math.random()*20) + '条/秒\n';
              info_9.content = '输入:' + parseInt(Math.random()*20) + '条/秒\n';
          }
          t++;
      }

      view.draw();
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    return (
      <div>
        <InfoModal/>
        <PageHeader title="日志拓扑图">
          <span>日志拓扑图展示。</span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <canvas id="canvas" style={{width:"100%", height:"100%", backgroundColor:"white"}}></canvas>
          </Col>
        </Row>
      </div>
    );
  },
});

export default ArchitectureDiagramPage;
