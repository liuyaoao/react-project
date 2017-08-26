import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

require('!script!../../public/javascripts/paper-full.min.js');
const UnicomInternet_Img = 'public/images/device/lthlw.png';//联通互联网
const Telecom_Img = 'public/images/device/dxhlw.png';//电信互联网
const Lightning_Img = 'public/images/device/sd.png';//闪电
const In_Switch_Img = 'public/images/device/jrjhj.png';//接入交换机
const CORE_SWITCH_Img = 'public/images/device/hxjhj.png';//核心交换机
const LinkLoadBalance_Img = 'public/images/device/llfzjh.png';//链路负载均衡
const Ips_Img = 'public/images/device/ipsrqfy.png';//ips入侵防御
const FlowControl_Img = 'public/images/device/hxjhj.png';//流量控制
const Firewall_Img = 'public/images/device/fhq.png';//防火墙
const Firewall2_Img = 'public/images/device/fhq2.png';//防火墙
const Bank_Img = 'public/images/device/yh.png';//银行
const AcceptService_Img = 'public/images/device/sld.png';//银行
const SelfService_Img = 'public/images/device/zzpt.png';//自助平台
const Rck_Img = 'public/images/device/rck.png';//自助平台
const FILE_IMG = 'public/images/device/file.ico';//交换机

import BjcaModal from 'components/architecture/bjcaModal';
import AppConfig from 'util/AppConfig';

var dataList = [];

const BjcaPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  getInitialState: function() {
    return {
      deviceName:"",
      deviceType:"",
      dataList: dataList,
      deviceIP:"",
      defaultTime: '5m', //相对搜索默认时间  m h
      newData: [],
      ipAddress: "",
      hostname:"",
    }
  },
  _isLoading() {
    return !this.state.currentUser;
  },
  handleDevice(data){
    dataList.push(data);
    this.setState({dataList: dataList});
  },
  componentDidMount() {
      paper.install(window);
      var bjca = document.getElementById('bjca2');
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);
      const screenWidth = window.screen.width;
      const screenHeight= window.screen.height;

      console.log("width=",window.screen.width,"height",window.screen.height);

      var row1 = 70;
      var left45 = 45;
      var x = 160;
      var y = 250;
      var top = 120;
      var left = 450;
      var marginTop = 60;
      var deviceY_1 = top + 50;


      //整体方框
      let allRect = new Shape.Rectangle({
          top:0,
          size: [screenWidth*0.8, screenHeight],
          // fillColor: 'green',
          strokeColor: '#00B724'
      });
      //小矩形
      let smallRect = new Path.Rectangle({
          point: new Point(450, top+230),
          size: [260, 200],
          fillColor: '#F2F2F2'
          // strokeWidth: 40,
          // strokeColor: '#F2F2F2'
      });
      smallRect.opacity = 1;
      console.log("当前矩形的大小===",allRect);

      //第一个方框   200 350 100
      var rectangle_1 = new Shape.Rectangle({
          point: new Point(25, top+20),
          top:top,
          size: [450, 650],
          radius: 35,
          // fillColor: '#ADFDC1',
          strokeColor: '#006699'
      });
      rectangle_1.dashArray= [10, 4];
      var rectangle_title_1 = new PointText({
          point: new Point(screenWidth*0.8/2-50, top-50),
          top:0,
          content: '业务系统监控平台',
          fontSize:36,
          fontWeight:'bold',
          fillColor: '#005565',
          justification: 'center'
      });
      // rectangle_title_1.point = ;
      console.log(rectangle_title_1);

      var right_title_1 = new PointText({
          point: new Point(rectangle_1.position.x, top+620),
          top:0,
          content: '互联网接入区',
          fontSize:28,
          fontWeight:'bold',
          fillColor: '#00585B',
          justification: 'center'
      });
      //第二个方框
      var rectangle_2 = new Shape.Rectangle({
          top:top, //+170
          left:left+250,
          size: [690, 650], //480
          radius: 35,
          // fillColor: '#ADFDC1',
          strokeColor: '#006699'
      });
      rectangle_2.dashArray= [10, 4];
      var right_title_2 = new PointText({
          point: new Point(rectangle_1.position.x+rectangle_2.position.x-20, top+620),
          content: '业务生产区',
          fontSize:28,
          fontWeight:'bold',
          fillColor: '#00585B',
          justification: 'center'
      });


      //以该设备作为相对坐标
      var internet_1 = new Raster({
        source:UnicomInternet_Img,
        position:{x:x,y:3*marginTop+5}
      });
      var internet_title_1 = new PointText({
          point: new Point(internet_1.position.x, internet_1.position.y),
          // content: '联通互联网',
          fillColor: '#0099CC',
          justification: 'center'
      });
      var internet_2 = new Raster({
        source:Telecom_Img,
        position:{x:2*x,y:3*marginTop+5}
      });
      var internet_title_2 = new PointText({
          point: new Point(internet_2.position.x, internet_2.position.y),
          // content: '电信互联网',
          fillColor: '#0099CC',
          justification: 'center'
      });
      let lightning_1 = new Raster({
        source:Lightning_Img,
        position:{x:x,y:5*marginTop-35}
      });
      let lightning_2 = new Raster({
        source:Lightning_Img,
        position:{x:2*x,y:5*marginTop-35}
      });

      //线 1 3
      var vectorStart11 = new Point(x, 4*marginTop+20*5);
      var end11 = new Point(x, (4+1)*marginTop+25*4);
      var vector11 = end11.subtract(vectorStart11);
      var arrowVector11 = vector11.normalize(10);
      var jiantouxian11 = new Path([vectorStart11, end11]);
      var jiantou11= new Path([
          end11.add(arrowVector11.rotate(150)),
          end11,
          end11.add(arrowVector11.rotate(-150))
            ]);
      var vectorItem_11 = new Group([
          jiantouxian11,
          jiantou11
      ]);
      // vectorItem_11.rotate(90);
      jiantou11.strokeColor = 'green';
      jiantouxian11.strokeColor = '#0099CC';

      var vectorItem_12 = vectorItem_11.clone();
      vectorItem_12.position.y += 75;

      var vectorItem_13 = vectorItem_12.clone();
      vectorItem_13.position.y += 80;

      var vectorItem_14 = vectorItem_13.clone();
      vectorItem_14.position.y += 90;

      var vectorItem_21 = vectorItem_11.clone();
      vectorItem_21.position.x += 160;

      var vectorItem_22 = vectorItem_21.clone();
      vectorItem_22.position.y += 75;

      var vectorItem_23 = vectorItem_22.clone();
      vectorItem_23.position.y += 80;

      var vectorItem_24 = vectorItem_23.clone();
      vectorItem_24.position.y += 90;

      // new Group([
      //     new Path([new Point(x, 4*marginTop+20*4), new Point(x, (4+1)*marginTop+25*4)])
      // ]).strokeColor = '#0099CC';

      for(var i=4;i < 8;i++){
        //线1
        // new Group([
        //     new Path([new Point(x, i*marginTop+20*i), new Point(x, (i+1)*marginTop+25*i)])
        // ]).strokeColor = '#0099CC';
        // //线2
        // new Group([
        //     new Path([new Point(2*x, i*marginTop+20*i), new Point(2*x, (i+1)*marginTop+25*i)])
        // ]).strokeColor = '#0099CC';
        //最后一根线 以及交叉线
        if(i == 7){
          new Group([
              new Path([new Point(x, (i+1)*marginTop+25*i), new Point(2*x, (i+1)*marginTop+25*i)])
          ]).strokeColor = '#0099CC';

          var jc_line = new Group([
              new Path([new Point(x, (4)*marginTop+12*i), new Point(2*x, (5)*marginTop+16*i)])
          ]);
          jc_line.strokeColor= '#73A46C';
          jc_line.dashArray= [10, 4];
          var jc_line2 =new Group([
              new Path([new Point(x, (5)*marginTop+16*i), new Point(2*x, (4)*marginTop+12*i)])
          ]);
          jc_line2.strokeColor= '#73A46C';
          jc_line2.dashArray= [10, 4];
        }
      }
      //第二列  第一列不是循环生成的
      var strArray2 = ["接入交换机02","链路负载均衡02","IPS入侵防御02","流量控制02","防火墙02"];
      var imgArray2 =[In_Switch_Img,LinkLoadBalance_Img,Ips_Img,FlowControl_Img,Firewall_Img];
      for(var i=0;i < strArray2.length;i++){
        let raster = new Raster({
          id: "b"+i,
          source:imgArray2[i],
          position:{x:2*x,y:(i+5.5)*marginTop+20*i},
          context: strArray2[i]
        });
        raster.onClick = function(event) {
          var data = {};
          data.ip = '';
          data.type = "message";
          data.name = event.target.id;
          data.hostname = raster.context;
          this.getQueryData(data);

            // if(window.localStorage.job){
            //   var job = JSON.parse(window.localStorage.job);
            //   this.refs.clearBjcaModal._clearData();
            //   for(var i=0; i<job.length;i++){
            //     if(job[i].name === event.target.id){
            //       var data = {};
            //       data.ip = job[i].ip;
            //       data.type = "message";
            //       data.name = event.target.id;
            //       this.getData(data);
            //     }else{
            //       if(i === job.length-1){
            //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
            //       }
            //     }
            //   }
            // }else{
            //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
            // }
            $('#infoModal').modal('show');
        }.bind(this);
        new PointText({
            point: new Point(raster.position.x + row1, raster.position.y),
            content: strArray2[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }


      //线4
      var vectorStart = new Point(100, 100);
      var end = new Point(185, 100);
      var vector = end.subtract(vectorStart);
      var arrowVector = vector.normalize(10);
      var jiantouxian = new Path([vectorStart, end]);
      var jiantou2= new Path([
          end.add(arrowVector.rotate(150)),
          end,
          end.add(arrowVector.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_1 = new Group([
          jiantouxian,
          jiantou2
      ]);
      jiantou2.strokeColor = 'green';
      jiantouxian.strokeColor = '#0099CC';
      vectorItem_1.position.x += 3*x-35;
      vectorItem_1.position.y += i*marginTop-10;

      var vectorItem_2 = vectorItem_1.clone();
      vectorItem_2.position.y += 80;

      //线 1 3
      // var vectorItem_11 = vectorItem_1.clone();
      // vectorItem_11.rotate(90);
      // vectorItem_11.position.x += 130;
      // vectorItem_11.position.y += 125;

      //线 5
      var vectorItem_51 = vectorItem_1.clone();
      vectorItem_51.children[0].scale(1.5, 1, new Point(vectorItem_1.children[0].position.x-50, vectorItem_1.children[0].position.y));
      vectorItem_51.position.y += -210;
      vectorItem_51.position.x += 180+160;

      var vectorItem_52 = vectorItem_51.clone();
      vectorItem_52.position.y += 70;

      // 添加新线 5
      // var vectorStart511 = new Point(80, 0);//线长115 高40
      // var end511 = new Point(205, 60);
      // var vector511 = end511.subtract(vectorStart511);
      // var arrowVector511 = vector511.normalize(10);
      // var jiantouxian511 = new Path([vectorStart511, end511]);
      // var jiantou511= new Path([
      //     end511.add(arrowVector511.rotate(150)),
      //     end511,
      //     end511.add(arrowVector511.rotate(-150))
      //       ]);
      //     // jiantou2.dashArray = [1, 2];
      // var vectorItem_511 = new Group([
      //     jiantouxian511,
      //     jiantou511
      // ]);
      // jiantou511.strokeColor = 'green';
      // jiantouxian511.strokeColor = '#0099CC';
      // vectorItem_511.position.x += 3*x-35+365;
      // vectorItem_511.position.y += i*marginTop-100+180-15;
      //
      // var vectorStart512 = new Point(75, 65);//线长115 高40
      // var end512 = new Point(205, 0);
      // var vector512 = end512.subtract(vectorStart512);
      // var arrowVector512 = vector512.normalize(10);
      // var jiantouxian512 = new Path([vectorStart512, end512]);
      // var jiantou512= new Path([
      //     end512.add(arrowVector512.rotate(150)),
      //     end512,
      //     end512.add(arrowVector512.rotate(-150))
      //       ]);
      //     // jiantou2.dashArray = [1, 2];
      // var vectorItem_512 = new Group([
      //     jiantouxian512,
      //     jiantou512
      // ]);
      // jiantou512.strokeColor = 'green';
      // jiantouxian512.strokeColor = '#0099CC';
      // vectorItem_512.position.x += 3*x-35+365;
      // vectorItem_512.position.y += i*marginTop-100+180-15;

      var vectorStart53 = new Point(80, -35);//线长115 高40
      var end53 = new Point(205, 5);  // 145, 185
      var vector53 = end53.subtract(vectorStart53);
      var arrowVector53 = vector53.normalize(10);
      var jiantouxian53 = new Path([vectorStart53, end53]);
      var jiantou53= new Path([
          end53.add(arrowVector53.rotate(150)),
          end53,
          end53.add(arrowVector53.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_53 = new Group([
          jiantouxian53,
          jiantou53
      ]);
      jiantou53.strokeColor = 'green';
      jiantouxian53.strokeColor = '#0099CC';
      vectorItem_53.position.x += 3*x-35+365;
      vectorItem_53.position.y += i*marginTop-100+180-15;

      var vectorStart54 = new Point(80, -35);//线长115 高80
      var end54 = new Point(205, 45); // 145, 225
      var vector54 = end54.subtract(vectorStart54);
      var arrowVector54 = vector54.normalize(10);
      var jiantouxian54 = new Path([vectorStart54, end54]);
      var jiantou54= new Path([
          end54.add(arrowVector54.rotate(150)),
          end54,
          end54.add(arrowVector54.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_54 = new Group([
          jiantouxian54,
          jiantou54
      ]);
      jiantou54.strokeColor = 'green';
      jiantouxian54.strokeColor = '#0099CC';
      vectorItem_54.position.x += 3*x-35+365;
      vectorItem_54.position.y += i*marginTop-100+180-15+60;

      var vectorStart55 = new Point(80, -35);//线长115 高70
      var end55 = new Point(210, -105); // 145, 75
      var vector55 = end55.subtract(vectorStart55);
      var arrowVector55 = vector55.normalize(10);
      var jiantouxian55 = new Path([vectorStart55, end55]);
      var jiantou55= new Path([
          end55.add(arrowVector55.rotate(150)),
          end55,
          end55.add(arrowVector55.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_55 = new Group([
          jiantouxian55,
          jiantou55
      ]);
      jiantou55.strokeColor = 'green';
      jiantouxian55.strokeColor = '#0099CC';
      vectorItem_55.position.x += 3*x-35+360;
      vectorItem_55.position.y += i*marginTop-100+180-15+60+70;

      var vectorStart56 = new Point(80, -35);//线长115 高45
      var end56 = new Point(210, -80);  // 145, 100
      var vector56 = end56.subtract(vectorStart56);
      var arrowVector56 = vector56.normalize(10);
      var jiantouxian56 = new Path([vectorStart56, end56]);
      var jiantou56= new Path([
          end56.add(arrowVector56.rotate(150)),
          end56,
          end56.add(arrowVector56.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_56 = new Group([
          jiantouxian56,
          jiantou56
      ]);
      jiantou56.strokeColor = 'green';
      jiantouxian56.strokeColor = '#0099CC';
      vectorItem_56.position.x += 3*x-35+360;
      vectorItem_56.position.y += i*marginTop-100+180-15+60+140;

      // 外建连接线
      var vectorStart57 = new Point(80, -35);//线长115 高15
      var end57 = new Point(210, -50);  // 145, 100
      var vector57 = end57.subtract(vectorStart57);
      var arrowVector57 = vector57.normalize(10);
      var jiantouxian57 = new Path([vectorStart57, end57]);
      var jiantou57= new Path([
          end57.add(arrowVector57.rotate(150)),
          end57,
          end57.add(arrowVector57.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_57 = new Group([
          jiantouxian57,
          jiantou57
      ]);
      jiantou57.strokeColor = 'green';
      jiantouxian57.strokeColor = '#0099CC';
      vectorItem_57.position.x += 3*x-35+360;
      vectorItem_57.position.y += i*marginTop-100+180-15+60+210;

      var vectorStart58 = new Point(80, -35);//线长115 高15
      var end58 = new Point(210, -20);
      var vector58 = end58.subtract(vectorStart58);
      var arrowVector58 = vector58.normalize(10);
      var jiantouxian58 = new Path([vectorStart58, end58]);
      var jiantou58= new Path([
          end58.add(arrowVector58.rotate(150)),
          end58,
          end58.add(arrowVector58.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_58 = new Group([
          jiantouxian58,
          jiantou58
      ]);
      jiantou58.strokeColor = 'green';
      jiantouxian58.strokeColor = '#0099CC';
      vectorItem_58.position.x += 3*x-35+360;
      vectorItem_58.position.y += i*marginTop-100+180-15+60+280;

      var vectorStart59 = new Point(80, -35);//线长115 高15
      var end59 = new Point(350, -378);
      var vector59 = end59.subtract(vectorStart59);
      var arrowVector59 = vector59.normalize(10);
      var jiantouxian59 = new Path([vectorStart59, end59]);
      var jiantou59= new Path([
          end59.add(arrowVector59.rotate(150)),
          end59,
          end59.add(arrowVector59.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_59 = new Group([
          jiantouxian59,
          jiantou59
      ]);
      jiantou59.strokeColor = 'green';
      jiantouxian59.strokeColor = '#0099CC';
      vectorItem_59.position.x += 3*x-35+360;
      vectorItem_59.position.y += i*marginTop-100+180-15+60+350;

      var vectorStart61 = new Point(75, -55);//125, 225
      var end61 = new Point(185, 45);
      var vector61 = end61.subtract(vectorStart61);
      var arrowVector61 = vector61.normalize(10);
      var jiantouxian61 = new Path([vectorStart61, end61]);
      var jiantou61= new Path([
          end61.add(arrowVector61.rotate(150)),
          end61,
          end61.add(arrowVector61.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_61 = new Group([
          jiantouxian61,
          jiantou61
      ]);
      jiantou61.strokeColor = 'green';
      jiantouxian61.strokeColor = '#0099CC';
      vectorItem_61.position.x += 3*x-35+365+155;
      vectorItem_61.position.y += 250;

      var vectorStart62 = new Point(75, -55);//125, 235
      var end62 = new Point(185, 55);
      var vector62 = end62.subtract(vectorStart62);
      var arrowVector62 = vector62.normalize(10);
      var jiantouxian62 = new Path([vectorStart62, end62]);
      var jiantou62= new Path([
          end62.add(arrowVector62.rotate(150)),
          end62,
          end62.add(arrowVector62.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_62 = new Group([
          jiantouxian62,
          jiantou62
      ]);
      jiantou62.strokeColor = 'green';
      jiantouxian62.strokeColor = '#0099CC';
      vectorItem_62.position.x += 3*x-35+365+155;
      vectorItem_62.position.y += 250+70;

      var vectorStart63 = new Point(80, -35);//线长115 高80
      var end63 = new Point(210, -115); // 145, 65
      var vector63 = end63.subtract(vectorStart63);
      var arrowVector63 = vector63.normalize(10);
      var jiantouxian63 = new Path([vectorStart63, end63]);
      var jiantou63= new Path([
          end63.add(arrowVector63.rotate(150)),
          end63,
          end63.add(arrowVector63.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_63 = new Group([
          jiantouxian63,
          jiantou63
      ]);
      jiantou63.strokeColor = 'green';
      jiantouxian63.strokeColor = '#0099CC';
      vectorItem_63.position.x += 3*x-35+360+100+50;
      vectorItem_63.position.y += i*marginTop-100+180-15+60+70-80;

      var vectorStart64 = new Point(80, -35);//线长115 高95
      var end64 = new Point(210, -130); // 145, 65
      var vector64 = end64.subtract(vectorStart64);
      var arrowVector64 = vector64.normalize(10);
      var jiantouxian64 = new Path([vectorStart64, end64]);
      var jiantou64= new Path([
          end64.add(arrowVector64.rotate(150)),
          end64,
          end64.add(arrowVector64.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_64 = new Group([
          jiantouxian64,
          jiantou64
      ]);
      jiantou64.strokeColor = 'green';
      jiantouxian64.strokeColor = '#0099CC';
      vectorItem_64.position.x += 3*x-35+360+100+50;
      vectorItem_64.position.y += i*marginTop-100+180-15+60+70-80+100;

      var vectorStart65 = new Point(80, -35);//线长115 高95
      var end65 = new Point(200, -298); // 145, 65
      var vector65 = end65.subtract(vectorStart65);
      var arrowVector65 = vector65.normalize(10);
      var jiantouxian65 = new Path([vectorStart65, end65]);
      var jiantou65= new Path([
          end65.add(arrowVector65.rotate(150)),
          end65,
          end65.add(arrowVector65.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_65 = new Group([
          jiantouxian65,
          jiantou65
      ]);
      jiantou65.strokeColor = 'green';
      jiantouxian65.strokeColor = '#0099CC';
      vectorItem_65.position.x += 3*x-35+360+100+50;
      vectorItem_65.position.y += i*marginTop-100+180-15+60+70-80+200;

      var vectorStart66 = new Point(80, -35);//线长115 高95
      var end66 = new Point(205, -320); // 145, 66
      var vector66 = end66.subtract(vectorStart66);
      var arrowVector66 = vector66.normalize(10);
      var jiantouxian66 = new Path([vectorStart66, end66]);
      var jiantou66= new Path([
          end66.add(arrowVector66.rotate(150)),
          end66,
          end66.add(arrowVector66.rotate(-150))
            ]);
          // jiantou2.dashArray = [1, 2];
      var vectorItem_66 = new Group([
          jiantouxian66,
          jiantou66
      ]);
      jiantou66.strokeColor = 'green';
      jiantouxian66.strokeColor = '#0099CC';
      vectorItem_66.position.x += 3*x-35+360+100+50;
      vectorItem_66.position.y += i*marginTop-100+180-15+60+70-80+300;

      var vectorItem_71 = vectorItem_1.clone();
      vectorItem_71.children[0].scale(1.2, 1, new Point(vectorItem_1.children[0].position.x-50, vectorItem_1.children[0].position.y));
      vectorItem_71.position.x += 630-10;
      vectorItem_71.position.y += -88;

      var vectorItem_72 = vectorItem_1.clone();
      vectorItem_72.children[0].scale(1.2, 1, new Point(vectorItem_1.children[0].position.x-50, vectorItem_1.children[0].position.y));
      vectorItem_72.position.x += 630-10;
      vectorItem_72.position.y += -85+75;

      // var vectorStart1 = new Point(100, 100);
      // var end1 = new Point(200, 100);
      // var vector1 = end1.subtract(vectorStart);
      // var arrowVector1 = vector1.normalize(10);
      // var jiantouxian11 = new Path([vectorStart, end]);
      // var jiantou11= new Path([
      //     end1.add(arrowVector1.rotate(320)),
      //     end1,
      //     end1.add(arrowVector1.rotate(-320))
      //       ]);
      //     jiantou11.dashArray = [1, 2];
      // var vectorItem_233 = new Group([
      //     jiantouxian11,
      //     jiantou11
      // ]);
      // jiantou11.strokeColor = 'green';
      // jiantouxian11.opacity = 0;
      // vectorItem_233.position.x += 540;
      // vectorItem_233.position.y += i*marginTop-10;

      // var vectorItem_2 = new Group([
      //     jiantouxian,
      //     jiantou2
      // ]);
      // vectorItem_2.position.x += 3*x-35;
      // vectorItem_2.position.y += i*marginTop-10;
      //线4
      // new Group([
      //     new Path([new Point(3*x+50, i*marginTop+90), new Point(3*x+150, (i)*marginTop+90)])
      // ]).strokeColor = '#0099CC';
      new Group([
          new Path([new Point(3*x+50, i*marginTop+90+80), new Point(3*x+150, (i)*marginTop+90+80)])
      ]).strokeColor = '#0099CC';

      //第三列
      var strArray2 = ["核心交换机01","核心交换机02"];
      for(var i=0;i < strArray2.length;i++){
        var raster = new Raster({
          source:CORE_SWITCH_Img,
          position:{x:3*x+50,y:(i+6.5)*marginTop+25*i}//
        });
        var flagY = raster.position.y;
        // if(i == 0){
        //   flagY = flagY - row1/2;
        // }else{
          flagY = flagY + row1/2;
        // }
        new PointText({
            point: new Point(raster.position.x, flagY),
            content: strArray2[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }
      //第四列
      var strArray4 = ["防火墙01","防火墙02"];
      let fire2Array = [Firewall2_Img,Firewall2_Img];
      for(var i=0;i < strArray4.length;i++){
        var raster = new Raster({
          source:fire2Array[i],
          position:{x:(3*x+150),y:(i+6.5)*marginTop+20*i}//
        });
        var flagY = raster.position.y;
        // if(i == 0){
        //   flagY = flagY - row1/2;
        // }else{
          flagY = flagY + row1/2;
        // }
        new PointText({
            point: new Point(raster.position.x, flagY),
            content: strArray4[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }

      // //线5   x:(3*x+395),y:(i+6)*marginTop+10*i
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178), new Point(4*x+385, (3)*marginTop+178)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178+70), new Point(4*x+385, (3)*marginTop+178+70)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178+70+70), new Point(4*x+385, (3)*marginTop+178+70+70+60)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178+70+70+70+140), new Point(4*x+385, (3)*marginTop+178+70+70+70+90)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178+70+70+70+70), new Point(4*x+385, (3)*marginTop+178+70+70+60)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+235, (3)*marginTop+178+70+70+70+70+70), new Point(4*x+385, (3)*marginTop+178+70+70+70+70+20)])
      // ]).strokeColor = '#0099CC';
      //
      // //线6
      // new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178), new Point(4*x+515, (3)*marginTop+178+125)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178+70), new Point(4*x+515, (3)*marginTop+178+125+75)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178+70+135), new Point(4*x+515, (3)*marginTop+178+125)])
      // ]).strokeColor = '#0099CC';
      // new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178+70+135+95), new Point(4*x+515, (3)*marginTop+178+125+75)])
      // ]).strokeColor = '#0099CC';
      //线6 虚线
      var y_c_end1 = new Group([
          new Path([new Point(4*x+385, (1)*marginTop+118), new Point(4*x+515, (1)*marginTop+118+200)])
      ])
      y_c_end1.strokeColor = '#73A46C';
      y_c_end1.dashArray = [10, 4];

      var y_c_start2 = new Group([
          new Path([new Point(4*x+385, (1)*marginTop+118+70), new Point(4*x+515, (1)*marginTop+118+125)])
      ]);
      y_c_start2.strokeColor = '#73A46C';
      y_c_start2.dashArray = [10, 4];

      // 新添加虚线 178 - 118
      var y_c_end2 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118), new Point(4*x+385, (1)*marginTop+118+70)])
      ])
      y_c_end2.strokeColor = '#73A46C';
      y_c_end2.dashArray = [10, 4];

      var y_c_end3 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+75), new Point(4*x+385, (1)*marginTop+118)])
      ])
      y_c_end3.strokeColor = '#73A46C';
      y_c_end3.dashArray = [10, 4];

      var y_c_end3 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+75), new Point(4*x+385, (1)*marginTop+118)])
      ])
      y_c_end3.strokeColor = '#73A46C';
      y_c_end3.dashArray = [10, 4];

      var y_c_end4 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+70+75), new Point(4*x+385, (1)*marginTop+118+70+70+70+90)])
      ])
      y_c_end4.strokeColor = '#73A46C';
      y_c_end4.dashArray = [10, 4];

      var y_c_end5 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+70+70+70), new Point(4*x+385, (1)*marginTop+118+70+70+65)])
      ])
      y_c_end5.strokeColor = '#73A46C';
      y_c_end5.dashArray = [10, 4];

      var y_c_end6 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+70+70+70+70), new Point(4*x+385, (1)*marginTop+118+70+70+70+90)])
      ])
      y_c_end6.strokeColor = '#73A46C';
      y_c_end6.dashArray = [10, 4];

      var y_c_end7 = new Group([
          new Path([new Point(4*x+235, (1)*marginTop+118+70+70+70+70+70), new Point(4*x+385, (1)*marginTop+118+70+70+65)])
      ])
      y_c_end7.strokeColor = '#73A46C';
      y_c_end7.dashArray = [10, 4];

      // var r_c_start1 = new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178+70+135), new Point(4*x+515, (3)*marginTop+178+125)])
      // ]);
      // r_c_start1.strokeColor = '#73A46C';
      // r_c_start1.dashArray = [10, 4];
      //
      var r_c_end1 = new Group([
          new Path([new Point(4*x+385, (1)*marginTop+118+70+135), new Point(4*x+515, (1)*marginTop+118+125+75)])
      ])
      r_c_end1.strokeColor = '#73A46C';
      r_c_end1.dashArray = [10, 4];

      // var r_c_start2 = new Group([
      //     new Path([new Point(4*x+385, (3)*marginTop+178+70+135), new Point(4*x+515, (3)*marginTop+178+125)])
      // ]);
      // r_c_start2.strokeColor = '#73A46C';
      // r_c_start2.dashArray = [10, 4];
      //
      var r_c_end2 = new Group([
          new Path([new Point(4*x+385, (1)*marginTop+118+70+135+95), new Point(4*x+515, (1)*marginTop+118+125)])
      ])
      r_c_end2.strokeColor = '#73A46C';
      r_c_end2.dashArray = [10, 4];

      var r_c_end3 = new Group([
          new Path([new Point(4*x+395, (1)*marginTop+118+70+135+205), new Point(4*x+515, (1)*marginTop+118+125+70)])
      ])
      r_c_end3.strokeColor = '#73A46C';
      r_c_end3.dashArray = [10, 4];

      var r_c_end4 = new Group([
          new Path([new Point(4*x+385, (1)*marginTop+118+70+135+300), new Point(4*x+524, (1)*marginTop+118+125-5)])
      ])
      r_c_end4.strokeColor = '#73A46C';
      r_c_end4.dashArray = [10, 4];

      //线7   fontWeight:'bold',
      // let line7 = new Group([
      //     new Path([new Point(4*x+385+130, (3)*marginTop+178+125), new Point(4*x+515+120, (3)*marginTop+178+125)])
      // ]);
      //   line7.style.fontWeight= "bold";
      //   line7.strokeColor = '#0099CC'
      // console.log("line7=",line7);
      // line7.fontWeight = "bold"
      // new Group([
      //     new Path([new Point(4*x+385+130, (3)*marginTop+178+125+75), new Point(4*x+515+120, (3)*marginTop+178+125+75)])
      // ]).strokeColor = '#0099CC';
      //线7 虚线
      var c_k_line1 = new Group([
          new Path([new Point(4*x+385+130, (1)*marginTop+118+125), new Point(4*x+515+120, (1)*marginTop+118+125+75)])
      ]);
      c_k_line1.strokeColor = '#73A46C';
      c_k_line1.dashArray = [10, 4];
      var c_k_line2 = new Group([
          new Path([new Point(4*x+385+130, (1)*marginTop+118+125+75), new Point(4*x+515+120, (1)*marginTop+118+125)])
      ]);
      c_k_line2.strokeColor = '#73A46C';
      c_k_line2.dashArray = [10, 4];

      //第五列 六列 七列===========================
      var strArray5 = ["web终端01","web终端02","服务点01","服务点02","自助平台01","自助平台02", "web终端03", "web终端04", "web终端05"]; //"外键RA01", "外键RA02", "外键RA03"
      let bankArray = [Bank_Img,Bank_Img,AcceptService_Img,AcceptService_Img,SelfService_Img,SelfService_Img,Bank_Img,Bank_Img,Bank_Img];
      for(var i=0;i < strArray5.length;i++){
        let raster = new Raster({
          id: "c"+i,
          source:bankArray[i],
          position:{x:(3*x+395),y:(i+3)*marginTop+10*i},
          context: strArray5[i]
        });

        raster.onClick = function(event) {
          var data = {};
          data.ip = '';
          data.type = "message";
          data.name = event.target.id;
          data.hostname = raster.context;
          this.getQueryData(data);

            // if(window.localStorage.job){
            //   var job = JSON.parse(window.localStorage.job);
            //   this.refs.clearBjcaModal._clearData();
            //   for(var i=0; i<job.length;i++){
            //     if(job[i].name === event.target.id){
            //       var data = {};
            //       data.ip = job[i].ip;
            //       data.type = "message";
            //       data.name = event.target.id;
            //       data.hostname = raster.context;
            //       this.getData(data);
            //     }else{
            //       if(i === job.length-1){
            //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: "", hostname: raster.context});
            //       }
            //     }
            //   }
            // }else{
            //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: "", hostname: raster.context});
            // }
          $('#infoModal').modal('show');
        }.bind(this);
        var flagY = raster.position.y;
        // if(i == 0){
        //   flagY = flagY - row1/2;
        // }else{
          // flagY = flagY + row1/2;
        // }
        new PointText({
            point: new Point(raster.position.x-60, flagY),
            content: strArray5[i],
            fillColor: '#528D93',
            justification: 'center'
        });
      }

      var strArray6 = ["转换终端01","转换终端02","转换终端03","转换终端04","转换终端05","转换终端06"];
      let raArray = [Bank_Img,Bank_Img,Rck_Img,Rck_Img,Rck_Img,Rck_Img];
      for(var i=0;i < strArray6.length;i++){
        let raster;
        if(i > 1){//下
          raster = new Raster({
            id: "d"+i,
            source:raArray[i],
            context: strArray6[i],
            position:{x:(3*x+550),y:(i+3)*marginTop+40*i}//
          });
        }else{
          raster = new Raster({
            id: "d"+i,
            source:raArray[i],
            context: strArray6[i],
            position:{x:(3*x+550),y:(i+3)*marginTop+10*i}//
          });
        }
        raster.onClick = function(event) {
          var data = {};
          data.ip = '';
          data.type = "raDuration";
          data.name = event.target.id;
          data.hostname = raster.context;
          this.getQueryData(data);

          // if(window.localStorage.job){
          //   var job = JSON.parse(window.localStorage.job);
          //   this.refs.clearBjcaModal._clearData();
          //   for(var i=0; i<job.length;i++){
          //     if(job[i].name === event.target.id){
          //       var data = {};
          //       data.ip = job[i].ip;
          //       data.type = "raDuration";
          //       data.name = event.target.id;
          //       this.getData(data);
          //     }else{
          //       if(i === job.length-1){
          //         this.setState({deviceType: "raDuration",deviceName:event.target.id, ipAddress: ""});
          //       }
          //     }
          //   }
          // }else{
          //   this.setState({deviceType: "raDuration",deviceName:event.target.id, ipAddress: ""});
          // }
          $('#infoModal').modal('show');
        }.bind(this);
        var flagY = raster.position.y;
        new PointText({
            point: new Point(raster.position.x, flagY+35),
            content: strArray6[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }

      var strArray7 = ["核心业务服务器01","核心业务服务器02"];
      let caArray = [Rck_Img,Rck_Img];
      for(var i=0;i < strArray7.length;i++){
        let raster = new Raster({
          id: "e"+i,
          source:caArray[i],
          context: strArray7[i],
          position:{x:(3*x+680),y:(i+5)*marginTop+20*i}//
        });
        var flagY = raster.position.y;
        if(i == 0){
          flagY = flagY - row1/2+10;
        }else{
          flagY = flagY + row1/2;
        }
        raster.onClick = function(event) {
          var data = {};
          data.ip = '';
          data.type = "caDuration";
          data.name = event.target.id;
          data.hostname = raster.context;
          this.getQueryData(data);

              // if(window.localStorage.job){
              //   var job = JSON.parse(window.localStorage.job);
              //   this.refs.clearBjcaModal._clearData();
              //   for(var i=0; i<job.length;i++){
              //     if(job[i].name === event.target.id){
              //       var data = {};
              //       data.ip = job[i].ip;
              //       data.type = "caDuration";
              //       data.name = event.target.id;
              //       this.getData(data);
              //     }else{
              //       if(i === job.length-1){
              //         this.setState({deviceType: "caDuration",deviceName:event.target.id, ipAddress: ""});
              //       }
              //     }
              //   }
              // }else{
              //   this.setState({deviceType: "caDuration",deviceName:event.target.id, ipAddress: ""});
              // }
            $('#infoModal').modal('show');
        }.bind(this);
        new PointText({
            point: new Point(raster.position.x, flagY),
            content: strArray7[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }

      var strArray8 = ["加密服务器01","加密服务器02"];
      let kmArray = [Rck_Img,Rck_Img];
      for(var i=0;i < strArray8.length;i++){
        let raster = new Raster({
          id: "f"+i,
          source:kmArray[i],
          context: strArray8[i],
          position:{x:(3*x+800),y:(i+5)*marginTop+20*i}//
        });
        raster.onClick = function(event) {
          var data = {};
          data.ip = '';
          data.type = "kmDuration";
          data.name = event.target.id;
          data.hostname = raster.context;
          this.getQueryData(data);

                  // if(window.localStorage.job){
                  //   var job = JSON.parse(window.localStorage.job);
                  //   this.refs.clearBjcaModal._clearData();
                  //   for(var i=0; i<job.length;i++){
                  //     if(job[i].name === event.target.id){
                  //       var data = {};
                  //       data.ip = job[i].ip;
                  //       data.type = "kmDuration";
                  //       data.name = event.target.id;
                  //       this.getData(data);
                  //     }else{
                  //       if(i === job.length-1){
                  //         this.setState({deviceType: "kmDuration",deviceName:event.target.id, ipAddress: ""});
                  //       }
                  //     }
                  //   }
                  // }else{
                  //   this.setState({deviceType: "kmDuration",deviceName:event.target.id, ipAddress: ""});
                  // }
            $('#infoModal').modal('show');
        }.bind(this);
        var flagY = raster.position.y;
        // if(i == 0){
        //   flagY = flagY - row1/2;
        // }else{
        //   flagY = flagY + row1/2;
        // }
        new PointText({
            point: new Point(raster.position.x+50, flagY),
            content: strArray8[i],
            fillColor: '#0099CC',
            justification: 'center'
        });
      }

      var jrjhj_1 = new Raster({
        id: "jrjhj_1",
        source:In_Switch_Img,
        position:{x:x,y:5.5*marginTop},//270
        context: '接入交换机01'
      });
      jrjhj_1.onClick = function(event) {
        var data = {};
        data.ip = '';
        data.type = "message";
        data.name = event.target.id;
        data.hostname = jrjhj_1.context;
        this.getQueryData(data);
                // if(window.localStorage.job){
                //   var job = JSON.parse(window.localStorage.job);
                //   this.refs.clearBjcaModal._clearData();
                //   for(var i=0; i<job.length;i++){
                //     if(job[i].name === event.target.id){
                //       var data = {};
                //       data.ip = job[i].ip;
                //       data.type = "message";
                //       data.name = event.target.id;
                //       this.getData(data);
                //     }else{
                //       if(i === job.length-1){
                //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                //       }
                //     }
                //   }
                // }else{
                //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                // }
          $('#infoModal').modal('show');
      }.bind(this);
      var jrjhj_title_1 = new PointText({
          point: new Point(jrjhj_1.position.x - row1, jrjhj_1.position.y),
          content: '接入交换机01',
          fillColor: '#0099CC',
          justification: 'center'
      });

      var llfzjh_1 = new Raster({
        id: "llfzjh_1",
        source:LinkLoadBalance_Img,
        position:{x:x,y:6.5*marginTop+20},
        context: '链路负载均衡01'
      });
      llfzjh_1.onClick = function(event) {
        var data = {};
        data.ip = '';
        data.type = "message";
        data.name = event.target.id;
        data.hostname = llfzjh_1.context;
        this.getQueryData(data);
                // if(window.localStorage.job){
                //   var job = JSON.parse(window.localStorage.job);
                //   this.refs.clearBjcaModal._clearData();
                //   for(var i=0; i<job.length;i++){
                //     if(job[i].name === event.target.id){
                //       var data = {};
                //       data.ip = job[i].ip;
                //       data.type = "message";
                //       data.name = event.target.id;
                //       this.getData(data);
                //     }else{
                //       if(i === job.length-1){
                //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                //       }
                //     }
                //   }
                // }else{
                //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                // }
          $('#infoModal').modal('show');
      }.bind(this);
      var llfzjh_title_1 = new PointText({
          point: new Point(llfzjh_1.position.x - row1, llfzjh_1.position.y),
          content: '链路负载均衡01',
          fillColor: '#0099CC',
          justification: 'center'
      });

      var ipsrjfy_1 = new Raster({
        id: "ipsrjfy_1",
        source:Ips_Img,
        position:{x:x,y:7.5*marginTop+40},
        context: 'IPS入侵防御01'
      });
      ipsrjfy_1.onClick = function(event) {
        var data = {};
        data.ip = '';
        data.type = "message";
        data.name = event.target.id;
        data.hostname = ipsrjfy_1.context;
        this.getQueryData(data);
                // if(window.localStorage.job){
                //   var job = JSON.parse(window.localStorage.job);
                //   this.refs.clearBjcaModal._clearData();
                //   for(var i=0; i<job.length;i++){
                //     if(job[i].name === event.target.id){
                //       var data = {};
                //       data.ip = job[i].ip;
                //       data.type = "message";
                //       data.name = event.target.id;
                //       this.getData(data);
                //     }else{
                //       if(i === job.length-1){
                //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                //       }
                //     }
                //   }
                // }else{
                //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                // }
          $('#infoModal').modal('show');
      }.bind(this);
      var ipsrjfy_title_1 = new PointText({
          point: new Point(ipsrjfy_1.position.x - row1, ipsrjfy_1.position.y),
          content: 'IPS入侵防御01',
          fillColor: '#0099CC',
          justification: 'center'
      });

      var llkz_1 = new Raster({
        id: "llkz_1",
        source:CORE_SWITCH_Img,
        position:{x:x,y:8.5*marginTop+60},
        context: '流量控制01'
      });
      llkz_1.onClick = function(event) {
        var data = {};
        data.ip = '';
        data.type = "message";
        data.name = event.target.id;
        data.hostname = llkz_1.context;
        this.getQueryData(data);
                // if(window.localStorage.job){
                //   var job = JSON.parse(window.localStorage.job);
                //   this.refs.clearBjcaModal._clearData();
                //   for(var i=0; i<job.length;i++){
                //     if(job[i].name === event.target.id){
                //       var data = {};
                //       data.ip = job[i].ip;
                //       data.type = "message";
                //       data.name = event.target.id;
                //       this.getData(data);
                //     }else{
                //       if(i === job.length-1){
                //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                //       }
                //     }
                //   }
                // }else{
                //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                // }
          $('#infoModal').modal('show');
      }.bind(this);
      var llkz_title_1 = new PointText({
          point: new Point(llkz_1.position.x - row1, llkz_1.position.y),
          content: '流量控制01',
          fillColor: '#0099CC',
          justification: 'center'
      });

      var fhq_1 = new Raster({
        id: "fhq_1",
        source:Firewall_Img,
        position:{x:x,y:9.5*marginTop+80},
        context: '防火墙01'
      });
      fhq_1.onClick = function(event) {
        var data = {};
        data.ip = '';
        data.type = "message";
        data.name = event.target.id;
        data.hostname = fhq_1.context;
        this.getQueryData(data);
                // if(window.localStorage.job){
                //   var job = JSON.parse(window.localStorage.job);
                //   this.refs.clearBjcaModal._clearData();
                //   for(var i=0; i<job.length;i++){
                //     if(job[i].name === event.target.id){
                //       var data = {};
                //       data.ip = job[i].ip;
                //       data.type = "message";
                //       data.name = event.target.id;
                //       this.getData(data);
                //     }else{
                //       if(i === job.length-1){
                //         this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                //       }
                //     }
                //   }
                // }else{
                //   this.setState({deviceType: "message",deviceName:event.target.id, ipAddress: ""});
                // }
          $('#infoModal').modal('show');
      }.bind(this);
      var fhq_title_1 = new PointText({
          point: new Point(fhq_1.position.x - row1, fhq_1.position.y),
          content: '防火墙01',
          fillColor: '#0099CC',
          justification: 'center'
      });









      //测试=================================
      // var interchanger_1 = new Shape.Rectangle({
      //     center: [700, 700],
      //     size: [80, 80],
      //     fillColor: '#ADFDC1',
      //     strokeColor: '#00B724'
      // });
      // var interchanger_title_1 = new PointText({
      //     point: new Point(interchanger_1.position.x, interchanger_1.position.y + 65),
      //     content: '测试',
      //     fillColor: '#0099CC',
      //     justification: 'center'
      // });
      // var interchanger_info_1 = new PointText({
      //     point: new Point(interchanger_1.position.x, interchanger_1.position.y),
      //     content: '终端信息',
      //     fillColor: '#0099CC',
      //     justification: 'center'
      // });
      // interchanger_1.dashArray = [10, 4];//虚线
      // // interchanger_1.scale(1.5);//比例值
      // interchanger_1.on('mouseenter', function() {
      //     this.fillColor = '#0099CC';
      // });
      // interchanger_1.on('mouseleave', function() {
      //     this.fillColor = 'red';
      // });
      //
      // var interchanger_2 = new Shape.Rectangle({
      //     center: [700, 700],
      //     size: [80, 80],
      //     fillColor: '#ADFDC1',
      //     strokeColor: '#00B724'
      // });
      // interchanger_2.position.x +=180;
      // interchanger_2.rotate(90);
      // var interchanger_title_2 = new PointText({
      //     point: new Point(interchanger_2.position.x, interchanger_2.position.y + 65),
      //     content: '测试2',
      //     fillColor: '#0099CC',
      //     justification: 'center'
      // });
      // var interchanger_info_2 = new PointText({
      //     point: new Point(interchanger_2.position.x, interchanger_2.position.y),
      //     content: '终端信息2',
      //     fillColor: '#0099CC',
      //     justification: 'center'
      // });



      // var LineStart = new Point(700, 700);
      // var LineEnd = new Point(800, 700);
      // var LineVector = LineEnd.subtract(LineStart);
      // var LineArrow = LineVector.normalize(10);
      // var LineVectorItem_1 = new Group([
      //     new Path([LineStart, LineEnd]),
      //     new Path([
      //         LineEnd.add(LineArrow.rotate(150)),
      //   LineEnd,
      //   LineEnd.add(LineArrow.rotate(-150))
      //     ])
      // ]);
      // LineVectorItem_1.dashArray = [10, 4];//虚线
      // LineVectorItem_1.strokeColor = 'red';
      // LineVectorItem_1.position.x += 40;




      var t = 0;
      var lastScale = 1;
        var center = view.center;
        console.log(view);
      view.onFrame = function(event) {
          // console.log(event);
          // count:1
          // delta:0.440000057220459
          // time:0.440000057220459
        //箭头动画  vectorItem_2

          vectorItem_11.children[1].position.y = vectorItem_11.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_11.children[0].length;
          vectorItem_12.children[1].position.y = vectorItem_12.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_12.children[0].length;
          vectorItem_13.children[1].position.y = vectorItem_13.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_13.children[0].length;
          vectorItem_14.children[1].position.y = vectorItem_14.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_14.children[0].length;
          vectorItem_21.children[1].position.y = vectorItem_21.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_21.children[0].length;
          vectorItem_22.children[1].position.y = vectorItem_22.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_22.children[0].length;
          vectorItem_23.children[1].position.y = vectorItem_23.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_23.children[0].length;
          vectorItem_24.children[1].position.y = vectorItem_24.children[0].position.y - 30 + event.count%180 / 180 * vectorItem_24.children[0].length;
          vectorItem_1.children[1].position.x = vectorItem_1.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_1.children[0].length;
          vectorItem_2.children[1].position.x = vectorItem_2.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_2.children[0].length;
          // vectorItem_51.children[1].position.x = vectorItem_51.children[0].position.x + 130 - event.count%540 / 540 * vectorItem_51.children[0].length;//从后往前流向
          vectorItem_51.children[1].position.x = vectorItem_51.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_51.children[0].length;
          vectorItem_52.children[1].position.x = vectorItem_52.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_52.children[0].length;

          //宽高 127  68    525   +68  = 593    505 + 68 = 573
          vectorItem_53.children[1].position.x = vectorItem_53.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_53.children[0].length;
          vectorItem_53.children[1].position.y = vectorItem_53.children[0].position.y - 22 + event.count%180 / 180 * (vectorItem_53.children[0].length-88);

          vectorItem_54.children[1].position.x = vectorItem_54.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_54.children[0].length;
          vectorItem_54.children[1].position.y = vectorItem_54.children[0].position.y - 22-20 + event.count%180 / 180 * (vectorItem_54.children[0].length-56);

          vectorItem_55.children[1].position.x = vectorItem_55.children[0].position.x-65 + event.count%180 / 180 * vectorItem_55.children[0].length;
          vectorItem_55.children[1].position.y = vectorItem_55.children[0].position.y+36 - event.count%180 / 180 * (vectorItem_55.children[0].length-69);

          vectorItem_56.children[1].position.x = vectorItem_56.children[0].position.x-65 + event.count%180 / 180 * vectorItem_56.children[0].length;
          vectorItem_56.children[1].position.y = vectorItem_56.children[0].position.y+36-12 - event.count%180 / 180 * (vectorItem_56.children[0].length-69-19);

          vectorItem_57.children[1].position.x = vectorItem_57.children[0].position.x-65 + event.count%180 / 180 * vectorItem_57.children[0].length;
          vectorItem_57.children[1].position.y = vectorItem_57.children[0].position.y+36-27 - event.count%180 / 180 * (vectorItem_57.children[0].length-69-45);

          vectorItem_58.children[1].position.x = vectorItem_58.children[0].position.x-65 + event.count%180 / 180 * vectorItem_58.children[0].length;
          vectorItem_58.children[1].position.y = vectorItem_58.children[0].position.y-8 + event.count%180 / 180 * (vectorItem_58.children[0].length-69-46);

          vectorItem_59.children[1].position.x = vectorItem_59.children[0].position.x-65-60 + (event.count%180 / 300 * vectorItem_59.children[0].length);
          vectorItem_59.children[1].position.y = vectorItem_59.children[0].position.y+160 - event.count%180 / 300 * (vectorItem_59.children[0].length+123);

          vectorItem_61.children[1].position.x = vectorItem_61.children[0].position.x - 65+5 + event.count%180 / 180 * (vectorItem_61.children[0].length-35);
          vectorItem_61.children[1].position.y = vectorItem_61.children[0].position.y - 65+10 + event.count%180 / 180 * (vectorItem_61.children[0].length-56+13);


          vectorItem_62.children[1].position.x = vectorItem_62.children[0].position.x - 65 + event.count%180 / 180 * (vectorItem_62.children[0].length-35);
          vectorItem_62.children[1].position.y = vectorItem_62.children[0].position.y - 65 + event.count%180 / 180 * (vectorItem_62.children[0].length-56+20);

          vectorItem_63.children[1].position.x = vectorItem_63.children[0].position.x-65 + event.count%180 / 180 * (vectorItem_63.children[0].length-35);
          vectorItem_63.children[1].position.y = vectorItem_63.children[0].position.y+36+5 - event.count%180 / 180 * (vectorItem_63.children[0].length-79);

          vectorItem_64.children[1].position.x = vectorItem_64.children[0].position.x-65 + event.count%180 / 180 * (vectorItem_64.children[0].length-35);
          vectorItem_64.children[1].position.y = vectorItem_64.children[0].position.y+36+13 - event.count%180 / 180 * (vectorItem_64.children[0].length-79+10);

          vectorItem_65.children[1].position.x = vectorItem_65.children[0].position.x-65 + event.count%180 / 360 * (vectorItem_65.children[0].length-35);
          vectorItem_65.children[1].position.y = vectorItem_65.children[0].position.y+36+100 - event.count%180 / 360 * (vectorItem_65.children[0].length+258);

          vectorItem_66.children[1].position.x = vectorItem_66.children[0].position.x-65 + event.count%180 / 370 * (vectorItem_66.children[0].length-35);
          vectorItem_66.children[1].position.y = vectorItem_66.children[0].position.y+36+108 - event.count%180 / 370 * (vectorItem_66.children[0].length+308);

          vectorItem_71.children[1].position.x = vectorItem_71.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_71.children[0].length;
          vectorItem_72.children[1].position.x = vectorItem_72.children[0].position.x - 50 + event.count%180 / 180 * vectorItem_72.children[0].length;

          // 添加新线 5
          // vectorItem_511.children[1].position.x = vectorItem_511.children[0].position.x - 65-1 + event.count%180 / 180 * vectorItem_511.children[0].length;
          // vectorItem_511.children[1].position.y = vectorItem_511.children[0].position.y - 25-7 + event.count%180 / 180 * (vectorItem_511.children[0].length-74);
          //
          // vectorItem_512.children[1].position.x = vectorItem_512.children[0].position.x - 65 + event.count%180 / 180 * (vectorItem_512.children[0].length);
          // vectorItem_512.children[1].position.y = vectorItem_512.children[0].position.y + 35 + event.count%180 / 180 * (vectorItem_512.children[0].length-220);
          // console.log(vectorItem_511.children[1].position);
          // console.log(vectorItem_53.children[1].position);
          // vectorItem_61.children[1].position.x = vectorItem_61.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_61.children[0].length;
          // vectorItem_61.children[1].position.x = vectorItem_61.children[0].position.x - 65 + event.count%180 / 180 * vectorItem_61.children[0].length;

          // console.log("vectorItem_53.children[0].position.y=",vectorItem_53.children[0].position.y,"event.count=",event.count,"vectorItem_53.children[0].length==",vectorItem_53.children[0].length);
          // vectorItem_233.children[1].position.x = vectorItem_233.children[0].position.x - 50 - event.count%180 / 180 * vectorItem_233.children[0].length;
        // LineVectorItem_1.children[1].position.x = LineVectorItem_1.children[0].position.x - 50 + event.count%180 / 180 * LineVectorItem_1.children[0].length;
        //线条色
        // interchanger_2.strokeColor.hue += 1;
        // interchanger_2.strokeWidth = Math.abs(Math.sin(event.count / 40)) * 3;
        // //背景色
        // interchanger_2.fillColor.alpha = 0.8*Math.abs(Math.sin(event.count / 40)) + 0.2;
        // interchanger_2.fillColor.hue += 2;
        // //旋转
        // interchanger_2.rotate(10);
        // interchanger_1.rotate(5);
        // jrjhj_1.rotate(10);

      }

      view.draw();
  },
  getData(data, defaultTime){
    var _this = this;
      var now = new Date();
      var sD = '';//起始时间    结束时间 -起始时间
      var eD = '';
        // var time = now.getTime() - 1000*60*30;//过去30分钟
      var tString = defaultTime ? defaultTime : this.state.defaultTime;
      var searchTime= '';
      if(data != null){
        var ipAddress = data.ip;
        var type = data.type;
        var savekey = data.name;
        var hostname = data.hostname;
      }
      if(tString.indexOf('m') > 0){//5 15 30
        var newStr=tString.replace("m","");
        var time = now.getTime()-1000*60*newStr;
        // console.log('过去半小时？',new Date(time));
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }else if(tString.indexOf('h') > 0){ //1 2 8
        var newStr=tString.replace("h","");
        var time = now.getTime()-1000*60*60*newStr;
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }
      var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";
      // var address = SERVERADDRESS+"business?action=bsstatistics&id=&start="+sD+"&end="+eD+"&from=&to=&type="+type+"&ip="+ipAddress+"&bushostname="+hostname+"&configtype=queryconfig";
      var address = SERVERADDRESS+"business?action=bsstatistics&id=&start="+sD+"&end="+eD+"&from=&to=&bstype="+type+"&ip="+"&bushostname="+hostname+"&configtype=queryconfig";
      $.ajax({
            type: "get",
            async: false,
            url: address,
            dataType: "json",
            cache:false,
            success: function (data) {
              if (type == 'message') {
                var results = [
                    { quotaName:'总记录数 (笔)', quotaValue:data.total},
                    { quotaName:'平均记录数 (笔)', quotaValue:data.avgtotal},
                    { quotaName:'最后记录时间', quotaValue:data.endTime}
                ];
              } else {
                var results = [
                    // { quotaName:'每分钟业务数 (笔)', quotaValue:data.avgbuseiness },
                    { quotaName:'总业务数 (笔)', quotaValue:data.total},
                    { quotaName:'业务平均时间 (毫秒)', quotaValue:data.avgtotal},
                    { quotaName:'最大业务时间 (毫秒)', quotaValue:data.maxTime},
                    { quotaName:'最小业务时间 (毫秒)', quotaValue:data.minTime},
                    { quotaName:'最后业务结束时间', quotaValue:data.endTime}
                ];
              }
              _this.setState({newData:results, ipAddress: data.ip});
            },
            timeout: 30000,
            error: function (data) {

            }
          });
  },

  getQueryData(data, defaultTime) {
    this.getData(data, defaultTime);
    this.setState({deviceType: data.type,deviceName: data.name, hostname: data.hostname});
  },

  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    //获取屏幕宽高
    let screenWidth = document.body.clientWidth;
    var flagStyle={
          width:"1500px",
          height:"950px",
          overflowX:"auto",
          marginLeft:"auto",
          marginRight:"auto"
        };
    if(screenWidth < 1280 && screenWidth > 1050){
        flagStyle.width="1200px";
    }else if(screenWidth < 1050){
        flagStyle.width="1050px";
    }
    // console.log(this.state.hostname);
    return (
      <div id="bjca2" style={flagStyle}>
        <BjcaModal deviceType={this.state.deviceType} deviceName={this.state.deviceName} deviceIP={this.state.deviceIP} newData={this.state.newData}
          ipAddress={this.state.ipAddress} hostname={this.state.hostname} ref="clearBjcaModal"
          getQueryData={this.getQueryData} />
        {/**
        <PageHeader title="日志拓扑图">
          <span>日志拓扑图展示。</span>
        </PageHeader>*/}
        <div id="bjca" style={{backgroundColor:"gray",width:"1500px",height:"900px",border:"gray 1px solid"}}>
          <canvas id="canvas" style={{width:"100%", height:"100%", backgroundColor:"white"}}></canvas>
        </div>
      </div>
    );
  },
});

export default BjcaPage;
