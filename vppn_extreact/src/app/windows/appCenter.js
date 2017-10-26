import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import Utils from '../script/utils';

var setWinHeight = function(id){
  var windowId = '#window-' + id;
  var height = $(windowId).height();
  var headerHeight = 38;  //49
  var hg1 = height - headerHeight;
  var hg2 = hg1 - 30;  // - 51 top tab height , - 60 bottom height
  $(windowId + ' .sidebar3').css("height", hg2);
  $(windowId + ' .wi-right').css("height", hg1);
  $(windowId + ' .wi-right-1').css("height", hg2 - 44);
  var wi_width = $(windowId + ' .wi-right-1').width()
  $(windowId + ' .list-content .list-desc').css("width", wi_width - 40 - 250 - 85);
}

var notInstalledApps = [
  { name: 'Calendar', version: '1.5.0.50', icon: 'images/icon/app03.png', desc: 'A practical computer desktop calendar'},
  { name: 'Note', version: '1.4.5.2', icon: 'images/icon/app06.png', desc: 'A small text editor'},
  { name: 'Calculator', version: '2.0.0.16', icon: 'images/icon/app04.png', desc: 'A versatile calculator'},
  { name: 'Xunlei', version: '9.1.23.556', icon: 'images/icon/app05.png', desc: 'A tool to provide download and independent upload software'},
  { name: 'Youku', version: '7.1.1.12088', icon: 'images/icon/app01.png', desc: 'Integrated multiple powerful video client'},
]

class AppCenter extends Component{

  componentDidMount(){
    setWinHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    $(".ws-select").select2();
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
  handleMouseMove = ()=>{
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setWinHeight(this.props.id);
    }
  }
  render() {
    var NotInstalledList = notInstalledApps.map(function(app, i){
      return (
        <div className="list" key={i}>
          {app.icon.indexOf('images/') > -1 ? <img src={app.icon} className="list-img" /> : <span className={app.icon + " list-icon"}></span>}
          <div className="list-content">
            <div className="list-header inline">
              <div className="list-title" title={app.name}>{app.name}</div>
              <div className="list-subtitle" title={"version: " + app.version}>version: {app.version}</div>
            </div>
            <div className="list-desc inline" title={app.desc}>{app.desc}</div>
            <div className="list-btn inline place-right">
              <button type="button" className="button success success2">Install</button>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className="grid condensed no-margin net-win" id="appWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <ul className="sidebar2 sidebar3">
              <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-widgets icon"></span> All</a></li>
              <li className=""><a onClick={this.handleShow.bind(this, 2)}><span className="mif-download2 icon"></span> Installed</a></li>
              <li className=""><a onClick={this.handleShow.bind(this, 3)}><span className="mif-loop2 icon"></span> Update</a></li>
            </ul>
          </div>
          <div className="cell colspan3 wi-right">
            <div className="wi active" id="wi_right_1">
              <div className="menu-header">
                <div className="p-l-10 menu-group">
                  <button type="button" className="ui black basic button">Manual Install</button>
                  <button type="button" className="ui black basic button">Refresh</button>
                  <button type="button" className="ui black basic button">Settings</button>
                </div>
              </div>
              <div className="wi-right-1">
                <div className="padding20">
                  <h5 className="app-title">Installed</h5>
                  <h5 className="app-title">Not Installed</h5>
                  <div className="listview app-list">
                    {NotInstalledList}
                  </div>
                </div>
              </div>
            </div>
            <div className="wi" id="wi_right_2">
              <div className="menu-header">
                <div className="p-l-10 menu-group">
                  <button type="button" className="button m-r-10">Manual Install</button>
                  <button type="button" className="button m-r-10">Refresh</button>
                  <button type="button" className="button">Settings</button>
                </div>
              </div>
              <div className="wi-right-1">
              </div>
            </div>
            <div className="wi" id="wi_right_3">
              <div className="menu-header">
                <div className="p-l-10 menu-group">
                  <button type="button" className="button m-r-10">Manual Install</button>
                  <button type="button" className="button m-r-10">Refresh</button>
                  <button type="button" className="button">Settings</button>
                </div>
              </div>
              <div className="wi-right-1">
                <div className="app-up">
                  {/*<span className="mif-earth2 icon up-icon"></span><br/>*/}
                  <img src="images/icon/app.png" className="up-icon" />
                  <label>All applications are the latest.</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  handleShow = (key, e)=>{
    $('#appWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#appWindow .sidebar3 li').each(function(){
      $(this).removeClass('active');
    })
    $(e.target.parentNode).addClass('active');
    $('#appWindow #wi_right_' + key).addClass('active');
  }
}

export default AppCenter;
