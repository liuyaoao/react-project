var React = require('react');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../actions/home_action';
import RouterFileSidebar from '../../components/router/fileSidebar';
import FileTable from '../../components/phone/file/fileTable';
import FileList from '../../components/phone/file/fileList';
import FileThumbnail from '../../components/phone/file/fileThumbnail';

var setWinHeight = function(id, width, height){
  var windowId = '#window-' + id;
  // var height = $(windowId).height();
  var headerHeight = 38;
  var hg1 = height - headerHeight;
  var hg2 = hg1 - 30;  // - 51 top tab height , - 60 bottom height
  $(windowId + ' .sidebar3').css("height", hg2);
  $(windowId + ' .wi-right').css("height", hg1);
  $(windowId + ' .wi-right-1').css("height", hg2);
  $(windowId + ' .fileTable_body').css("height", hg2 - 44 - 35);
}

var fileData = [
  {name: 'wan.txt', date: '2016-12-7 16:32', type: 'TEXT', size: '1 KB'},
  {name: 'wan2.txt', date: '2016-12-7 16:33', type: 'TEXT', size: '5 KB'},
  {name: 'wan3.txt', date: '2016-12-7 16:34', type: 'TEXT', size: '3 KB'},
  {name: 'wan4.txt', date: '2016-12-7 16:35', type: 'TEXT', size: '1 KB'},
  {name: 'wlan.html', date: '2016-12-8 13:32', type: 'HTML', size: '13 KB'},
]

var timer = null;
var RouterFileView = React.createClass({
  getInitialState: function(){
    return {
      menuStatus: 1,
      fileData: []
    }
  },
  componentDidMount: function() {
    var fileWindow = this.props.manager.get('file');
    setWinHeight(this.props.id, fileWindow.width, fileWindow.height);
    // document.addEventListener('mousemove', this.handleMouseMove);

    timer = setInterval(function(){
      if(this.props.windowSizeChange.flag && this.props.windowSizeChange.windowId=='file') {
        var fileWindow = this.props.manager.get('file');
        setWinHeight(this.props.id, fileWindow.width, fileWindow.height);
      }
    }.bind(this), 10);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   var cl = $("#window-" + this.props.id);
  //   if(cl.hasClass('active') && nextProps.windowSizeChange) {
  //     // var fileWindow = this.props.manager.get('file');
  //     // setWinHeight(this.props.id, fileWindow.width, fileWindow.height);
  //     this.props.actions.setWindowSizeChange(false);
  //   }
  //   return true;
  // },
  componentDidUpdate: function(nextProps, nextState) {
    var cl = $("#window-" + this.props.id);
    if(cl.hasClass('active')) {
      var fileWindow = this.props.manager.get('file');
      setWinHeight(this.props.id, fileWindow.width, fileWindow.height);
    }
  },
  componentWillUnmount: function() {
    // document.removeEventListener('mousemove', this.handleMouseMove);
    clearInterval(timer);
    timer = null;
  },
  // handleMouseMove: function(){
  //   var cl = $("#window-" + this.props.id);
  //   if (cl.hasClass('active')) {
  //     setWinHeight(this.props.id);
  //   }
  // },
  render: function() {
    var FileLsit = this._getFileList();
    return (
      <div className="grid condensed no-margin net-win" id="routerFileWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side" id="wi_left">
            <RouterFileSidebar />
          </div>
          <div className="cell colspan3 wi-right" id="wi_right">
            <div className="wi active" id="wi_right_1">
              <div className="wi-right-1">
                <div className="menu-header">
                  <div className="p-l-10 menu-group" data-role="group" data-group-type="one-state">
                    <button className="button active" onClick={this.handleToggleMenu.bind(this, 1)}><span className="mif-menu icon"></span></button>
                    <button className="button" onClick={this.handleToggleMenu.bind(this, 2)}><span className="mif-apps icon"></span></button>
                    <button className="button" onClick={this.handleToggleMenu.bind(this, 3)}><span className="mif-widgets icon"></span></button>
                  </div>
                  <form className="inline place-right" onSubmit={this.handleSearch}>
                    <div className="input-control text place-right m-r-10" data-role="input" style={{width:"18rem"}}>
                      <input type="text" placeholder="Search..." ref="searchFile"/>
                      <button type="submit" className="button"><span className="mif-search icon"></span></button>
                    </div>
                  </form>
                </div>
                {FileLsit}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  _getFileList: function(){
    var {menuStatus,fileData} = this.state;
    switch (menuStatus) {
      case 1:
        return <FileTable fileData={fileData} />
        break;
      case 2:
        return <FileList fileData={fileData} />
        break;
      case 3:
        return <FileThumbnail fileData={fileData} />
        break;
      default:
        break;
    }
  },
  handleToggleMenu: function(key) {
    this.setState({menuStatus: key});
  },
  handleSearch: function(e) {
    e.preventDefault();
  }
});

// module.exports = RouterFileView;
function mapStateToProps(state){
  const { windowSizeChange } = state.homeReducer;
  return {
    windowSizeChange
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterFileView);
