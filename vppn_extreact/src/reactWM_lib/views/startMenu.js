// var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import Settings from '../../settings';
import WindowContentTpl from './WindowContentTpl';
import windowsData from '../../datas/windowsData';

var timer = null, display = "";
class StartMenu extends Component{
  state = {
  }
  componentDidMount() {
    this.props.manager.on("click:desktop",this.onClickDesktop);
    this.props.manager.on("click:appbar",this.onClickAppbar);
    $('.start_menu_cnt').on('click','.open-menu-win', this.clickOpenMenuWindow);
    $('.start_menu_cnt').on('click','.tile', this.onClickMenuTile);
  }

  componentWillUnmount() {
    // clearInterval(timer);
    this.props.manager.off("click:desktop",this.onClickDesktop);
    this.props.manager.off("click:appbar",this.onClickAppbar);
    $('.start_menu_cnt').off('click','.open-menu-win', this.clickOpenMenuWindow);
    $('.start_menu_cnt').off('click','.tile', this.onClickMenuTile);
    timer = null;
  }

  handleClickStart = ()=>{
    this.props.manager.focus(null);
    $('#start-container .start_menu_cnt').toggleClass('disActive');
    $('#start-container .start_menu_cnt').toggleClass('active');
  }

  onClickDesktop = ()=>{
    $('#start-container .start_menu_cnt').addClass('disActive');
    $('#start-container .start_menu_cnt').removeClass('active');
  }
  onClickAppbar = ()=>{
    this.onClickDesktop();
  }
  //点击开始菜单的某一项，打开窗口。
  clickOpenMenuWindow = (evt)=>{
    console.log("clickOpenMenuWindow---:",evt,$(evt.target).closest('li').data('winid'));
    let winId = $(evt.target).closest('li').data('winid');
    this.showWindowByWinId(winId);
  }
  onClickMenuTile = (evt)=>{
    console.log("onClickMenuTile----");
    let winId = $(evt.target).closest('.tile').data('winid');
    this.showWindowByWinId(winId);
  }
  showWindowByWinId = (winId)=>{
    let bodyWidth = document.documentElement.clientWidth / 2;
    let bodyHeight = (document.documentElement.clientHeight - 50) / 2;
    let optsTemp = {
      id: 'tempWindow',
      title: '',
      width: 700,
      height: 370,
      x: 100,
      y: 100,
      contentComp:'',
      icon: ''
    };
    let curWinData = windowsData.filter((item) => { return item.id == winId})[0] || {};
    let windowOpts = Object.assign({}, optsTemp, curWinData);

    let focusWindow = this.props.manager.getLastFocusWindow();
    if(focusWindow){
      console.log("focusWindow.x:"+focusWindow.x+"; focusWindow.y"+focusWindow.y);
      windowOpts.x = focusWindow.x + 30;
      windowOpts.y = focusWindow.y + 36;
      //当最后一个活动窗口超出边界时，把该新打开的窗口
      if( focusWindow.x<-30||(focusWindow.x+windowOpts.width)>bodyWidth*2-30 || focusWindow.y<0||(focusWindow.y+windowOpts.height)>bodyHeight*2-36 ){
        windowOpts.x = bodyWidth - windowOpts.width / 2, windowOpts.y = bodyHeight - windowOpts.height / 2;
      }
    }else{
      windowOpts.x = bodyWidth - windowOpts.width / 2, windowOpts.y = bodyHeight - windowOpts.height / 2;
    }
    this.props.manager.open(windowOpts.id,
      <WindowContentTpl id={windowOpts.id} contentComp={windowOpts.contentComp} manager={this.props.manager}/>,
      windowOpts
    );

    if($('.app-bar-element').hasClass('active-container')) {
      $('.app-bar-element').removeClass('active-container');
    }
    if($('.dropdown-toggle.startBtn').hasClass('active-toggle')) {
      $('.dropdown-toggle.startBtn').removeClass('active-toggle');
    }
    this.onClickDesktop();
    $('#start-container').slideUp();
  }

  render () {
    return (
      <div className="app-bar-element">
        <div className="dropdown-toggle startBtn" onMouseDown={this.handleClickStart}>
          <img src="images/favicon.ico"/> Start
        </div>
        <div id="start-container" data-role="dropdown" data-no-close="true" style={{width:"1050px", height:"600px", display:"none"}}>
          <div className="start_menu_cnt disActive" style={{}}>
            <div className="side_menu">
              <ul className="v-menu block-shadow-impact darcula">
                <li style={{ cursor:"default",height:'55px'}}>
                  <img src="images/vin_d.jpg" data-role="fitImage" data-format="cycle"/>
                  <span style={{marginLeft:"50px",verticalAlign:'middle',lineHeight:'55px'}}>Administrator</span>
                </li>
                <li className="divider"></li>
                <li className="menu-title">Most Frequently Used</li>
                {
                  windowsData.map((win,index)=>{
                    return (
                      <li key={index} id={"mostUse_"+win.id} data-winid={win.id} className="open-menu-win">
                        <a><img src={win.icon}/> {win.title}</a>
                      </li>
                    )
                  })
                }
              </ul>
            </div>

            <div className="tile-area fg-white" style={{}}>
                <div className="tile-group double">
                    <span className="tile-group-title">Networking</span>

                    <div className="tile-container">

                        <div className="tile bg-indigo fg-white" data-role="tile" data-winid={'VlanWindow'} >
                            <div className="tile-content">
                                <img src="images/icon/VPN.png" style={{margin:'0 10%',width:'80%'}} />
                            </div>
                            <span className="tile-label" style={{padding:'0'}}>Cloud VPN</span>
                        </div>

                        <div className="tile bg-darkBlue fg-white" data-role="tile" data-winid={'NetworkCenterWindow'} >
                            <div className="tile-content">
                                <img src="images/icon/Network-Center.png" style={{margin:'0 10%',width:'80%'}} />
                            </div>
                            <span className="tile-label" style={{padding:'0'}}>Network Center</span>
                        </div>

                        <div className="tile-large bg-steel fg-white" data-role="tile">
                            <div className="tile-content" id="weather_bg" style={{background: "top left no-repeat", backgroundSize: "cover"}}>
                                <div className="padding10">
                                    <h1 id="weather_icon" style={{fontSize:"6em", position:"absolute", top:"10px", right:"10px"}}></h1>
                                    <h1 id="city_temp"></h1>
                                    <h2 id="city_name" className="text-light"></h2>
                                    <h4 id="city_weather"></h4>
                                    <p id="city_weather_daily"></p>

                                    <p className="no-margin text-shadow">Pressure: <span className="text-bold" id="pressure"></span> mm</p>
                                    <p className="no-margin text-shadow">Ozone: <span className="text-bold" id="ozone"></span></p>
                                    <p className="no-margin text-shadow">Wind bearing: <span className="text-bold" id="wind_bearing"></span></p>
                                    <p className="no-margin text-shadow">Wind speed: <span className="text-bold" id="wind_speed">0</span> m/s</p>
                                </div>
                            </div>
                            <span className="tile-label">Weather</span>
                        </div>
                    </div>
                </div>

                <div className="tile-group double">
                    <span className="tile-group-title">ReadySHARE</span>
                    <div className="tile-container">
                        <div className="tile-wide" data-role="tile" data-effect="slideLeft">
                            <div className="tile-content">
                                <a className="live-slide"><img src="images/1.jpg" data-role="fitImage" data-format="fill"/></a>
                                <a className="live-slide"><img src="images/2.jpg" data-role="fitImage" data-format="fill"/></a>
                                <a className="live-slide"><img src="images/3.jpg" data-role="fitImage" data-format="fill"/></a>
                                <a className="live-slide"><img src="images/4.jpg" data-role="fitImage" data-format="fill"/></a>
                                <a className="live-slide"><img src="images/5.jpg" data-role="fitImage" data-format="fill"/></a>
                            </div>
                            <div className="tile-label">Gallery</div>
                        </div>
                        <div className="tile" data-role="tile" data-role="tile" data-effect="slideUpDown">
                            <div className="tile-content">
                                <div className="live-slide"><img src="images/me.jpg" data-role="fitImage" data-format="fill"/></div>
                                <div className="live-slide"><img src="images/spface.jpg" data-role="fitImage" data-format="fill"/></div>
                            </div>
                            <div className="tile-label">Photos</div>
                        </div>
                        <div className="tile-small bg-amber fg-white" data-role="tile">
                            <div className="tile-content iconic">
                                <span className="icon mif-video-camera"></span>
                            </div>
                        </div>
                        <div className="tile-small bg-green fg-white" data-role="tile">
                            <div className="tile-content iconic">
                                <span className="icon mif-gamepad"></span>
                            </div>
                        </div>
                        <div className="tile-small bg-pink fg-white" data-role="tile">
                            <div className="tile-content iconic">
                                <span className="icon mif-headphones"></span>
                            </div>
                        </div>
                        <div className="tile-small bg-yellow fg-white" data-role="tile">
                            <div className="tile-content iconic">
                                <span className="icon mif-lock"></span>
                            </div>
                        </div>

                        <div className="tile-wide bg-orange fg-white" data-role="tile">
                            <div className="tile-content image-set">
                                <img src="images/jeki_chan.jpg"/>
                                <img src="images/shvarcenegger.jpg"/>
                                <img src="images/vin_d.jpg"/>
                                <img src="images/jolie.jpg"/>
                                <img src="images/jek_vorobey.jpg"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
}
export default StartMenu;
