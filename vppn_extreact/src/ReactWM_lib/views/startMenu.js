// var _ = require('lodash');
import $ from 'jquery';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Settings from '../../settings';

var timer = null, display = "";
class StartMenu extends Component{
  componentDidMount() {
    this.props.manager.on("click:desktop",this.onClickDesktop);
    this.props.manager.on("click:appbar",this.onClickAppbar);
    $('.open-menu-win').on('click', this.clickOpenMenuWindow);
  }

  componentWillUnmount() {
    // clearInterval(timer);
    this.props.manager.off("click:desktop",this.onClickDesktop);
    this.props.manager.off("click:appbar",this.onClickAppbar);
    $('.open-menu-win').off('click', this.clickOpenMenuWindow);
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
    let bodyWidth = document.documentElement.clientWidth / 2;
    let bodyHeight = (document.documentElement.clientHeight - 50) / 2;
    console.log("clickOpenMenuWindow---:",evt);
    let $li = $(evt.target).closest('li');
    var defaultOptions = {
      id: '',
      title: '',
      width: 1000,
      height: 570,
      x: 100,
      y: 100,
      icon: ''
    }
    switch ($li.attr('id')) {
      case 'menu-item-1':
        defaultOptions.id = 'settings-1';
        defaultOptions.title = 'Network Center';
        defaultOptions.icon = 'images/icon/Network-Center.png';
        break;
      case 'menu-item-2':
        defaultOptions.id = 'settings-2';
        defaultOptions.title = 'VPN Center';
        defaultOptions.icon = 'images/icon/VPN.png';
        defaultOptions.width = 1015;
        break;
      case 'app-center':
        defaultOptions.id = 'app-center';
        defaultOptions.title = 'App Center';
        defaultOptions.icon = 'images/icon/app.png';
        break;
      default:
        break;
    }
    defaultOptions.x = bodyWidth - defaultOptions.width / 2, defaultOptions.y = bodyHeight - defaultOptions.height / 2;
    this.props.manager.open(defaultOptions.id, <Settings id={defaultOptions.id}/>, defaultOptions);

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
          <div className="dropdown-toggle startBtn" onMouseDown={this.handleClickStart}><img src="images/favicon.ico"/> Start</div>
          <div id="start-container" data-role="dropdown" data-no-close="true" style={{width:"250px", height:"600px", display:"none"}}>
              <div className="start_menu_cnt disActive" style={{}}>
                  <div style={{position:"relative", cursor:"default"}}>
                    <img src="images/vin_d.jpg" data-role="fitImage" data-format="cycle"/>
                    <span style={{marginLeft:"50px"}}>Administrator</span>
                  </div>
                  <ul className="v-menu block-shadow-impact darcula" style={{height:"505px",width:"100%"}}>
                      <li className="divider"></li>
                      <li className="menu-title">Most Frequently Used</li>
                      
                      {/*<li id="menu-item-1" className="open-menu-win">
                        <a><img src="images/icon/Network-Center.png" /> Network Center</a>
                      </li>
                      <li id="menu-item-2" className="open-menu-win">
                        <a><img src="images/icon/VPN.png" /> VPN Center</a>
                      </li>
                      <li id="app-center" className="open-menu-win">
                        <a><img src="images/icon/app.png" /> App Center</a>
                      </li>*/}

                      {/*<li>
                          <a className="dropdown-toggle"><img src="images/icon/more.png" /> More...</a>
                          <ul className="d-menu" data-role="dropdown">
                              <li id="menu-item-3" className="open-menu-win"><a><span className="mif-calendar icon"></span> Open Win 3</a></li>
                              <li id="menu-item-4" className="open-menu-win"><a><span className="mif-image icon"></span> Open Win 4</a></li>
                          </ul>
                      </li>*/}
                  </ul>
                  {/*<ul className="v-menu block-shadow-impact darcula" style={{width:"100%"}}>
                      <li className="divider"></li>
                      <li><a href=""><span className="mif-switch icon"></span> Logout</a></li>
                  </ul>*/}
              </div>


              {/*<div className="tile-area fg-white">
                  <div className="tile-group double">
                      <span className="tile-group-title">Used</span>

                      <div className="tile-container">

                          <a className="tile bg-indigo fg-white" data-role="tile">
                              <div className="tile-content iconic">
                                  <span className="icon mif-calendar"></span>
                              </div>
                              <span className="tile-label">Calendar</span>
                          </a>

                          <div className="tile bg-darkBlue fg-white" data-role="tile">
                              <div className="tile-content iconic">
                                  <span className="icon mif-envelop"></span>
                              </div>
                              <span className="tile-label">Inbox</span>
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
                      <span className="tile-group-title">General</span>
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
              </div>*/}
          </div>
      </div>
    );
  }
}
export default StartMenu;
