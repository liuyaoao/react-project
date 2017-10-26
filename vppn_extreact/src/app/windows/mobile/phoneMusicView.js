var React = require('react');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../actions/home_action';
import PhoneMusicSidebar from '../../components/phone/musicSidebar';
import MusicTable from '../../components/phone/music/musicTable';
import MusicList from '../../components/phone/music/musicList';
import MusicThumbnail from '../../components/phone/music/musicThumbnail';
// import MusicPlay from '../../components/phone/music/musicPlay';
import MusicPlayer from '../../components/audio/MusicPlayer';

var setWinHeight = function(id, width, height){
  var windowId = '#window-' + id;
  // var height = $(windowId).height();
  var headerHeight = 38;
  var hg1 = height - headerHeight;
  var hg2 = hg1 - 30;  // - 51 top tab height , - 60 bottom height
  $(windowId + ' .sidebar3').css("height", hg2);
  $(windowId + ' .wi-right').css("height", hg1);
  $(windowId + ' .wi-right-1').css("height", hg2);
  $(windowId + ' .musicTable_body').css("height", hg2 - 44 - 35);
}

var musicData = [
  {label: 'secret_of_trash_island.mp3', duration: '01:48', artist: '', album: '', size: '1.65 MB', modifyDate: '12/15/2016 11:58', originalUrl: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/secret_of_trash_island.mp3'},
  {label: 'marty_mcpaper_theme.mp3', duration: '02:13', artist: '', album: '', size: '2.04 MB', modifyDate: '12/15/2016 11:58', originalUrl: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/marty_mcpaper_theme.mp3'},
  {label: 'in_the_hall_of_the_mountain_king.mp3', duration: '03:09', artist: '', album: '', size: '2.88 MB', modifyDate: '12/15/2016 11:59', originalUrl: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/in_the_hall_of_the_mountain_king.mp3'}
]

var timer = null;
var PhoneMusicView = React.createClass({
  getInitialState: function(){
    return {
      menuStatus: 1,
      musicData: [],
      // musicPlayList: []
    }
  },
  componentDidMount: function() {
    var phoneMusicWindow = this.props.manager.get('phone_music');
    setWinHeight(this.props.id, phoneMusicWindow.width, phoneMusicWindow.height);
    // document.addEventListener('mousemove', this.handleMouseMove);
    this.getMusics();

    timer = setInterval(function(){
      if(this.props.windowSizeChange.flag && this.props.windowSizeChange.windowId=='phone_music') {
        var phoneMusicWindow = this.props.manager.get('phone_music');
        setWinHeight(this.props.id, phoneMusicWindow.width, phoneMusicWindow.height);
      }
    }.bind(this), 10);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   var cl = $("#window-" + this.props.id);
  //   if(cl.hasClass('active') && nextProps.windowSizeChange) {
  //     // var phoneMusicWindow = this.props.manager.get('phone_music');
  //     // setWinHeight(this.props.id, phoneMusicWindow.width, phoneMusicWindow.height);
  //     this.props.actions.setWindowSizeChange(false);
  //   }
  //   return true;
  // },
  componentDidUpdate: function(nextProps, nextState) {
    var cl = $("#window-" + this.props.id);
    if(cl.hasClass('active')) {
      var phoneMusicWindow = this.props.manager.get('phone_music');
      setWinHeight(this.props.id, phoneMusicWindow.width, phoneMusicWindow.height);
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
    var MusicLsit = this._getMusicList();
    return (
      <div className="grid condensed no-margin net-win" id="phoneMusicWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <PhoneMusicSidebar />
          </div>
          <div className="cell colspan3 wi-right">
            <div className="wi active" id="wi_right_1">
              <div className="wi-right-1">
                <div className="menu-header">
                  <div className="p-l-10 menu-group" data-role="group" data-group-type="one-state">
                    <button className="button active" onClick={this.handleToggleMenu.bind(this, 1)}><span className="mif-menu icon"></span></button>
                    <button className="button" onClick={this.handleToggleMenu.bind(this, 2)}><span className="mif-apps icon"></span></button>
                    <button className="button" onClick={this.handleToggleMenu.bind(this, 3)}><span className="mif-widgets icon"></span></button>
                  </div>
                  <form className="inline place-right" onSubmit={this.handleSearch}>
                    <div className="input-control text m-r-10" data-role="input" style={{width:"18rem"}}>
                      <input type="text" placeholder="Search..." ref="searchMusic"/>
                      <button type="submit" className="button"><span className="mif-search icon"></span></button>
                    </div>
                  </form>
                </div>
                {MusicLsit}
              </div>
            </div>
            <div data-role="dialog, draggable" id="audioDialog" className="dialog" data-close-button="true" data-content-type="video">
              <div className="title"><span className="mif-play icon"></span> Music Player</div>
              {/*<MusicPlay ref="phoneMusicPlay" playlist={this.state.musicPlayList} />*/}
              <MusicPlayer ref="phoneMusicPlay" playlist={this.state.musicData}/>
            </div>
          </div>
        </div>
      </div>
    )
  },
  _getMusicList: function(){
    var { menuStatus, musicData } = this.state;
    switch (menuStatus) {
      case 1:
        return <MusicTable musicData={musicData} handlePlay={this.handlePlay} />
        break;
      case 2:
        return <MusicList musicData={musicData} handlePlay={this.handlePlay} />
        break;
      case 3:
        return <MusicThumbnail musicData={musicData} handlePlay={this.handlePlay} />
        break;
      default:
        break;
    }
  },
  handleToggleMenu: function(key) {
    this.setState({menuStatus: key});
  },
  handleSearch: function(e){
    e.preventDefault();
  },
  getMusics: function(){
    const { myPhoneIP } = this.props;
    var _this = this;
    $.ajax({
      type: "GET",
      async: true,
      url: "http://"+myPhoneIP+":12012/music",
      dataType: "json",
      cache:false,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          for(var i = 0; i < res.length; i++) {
            res[i].originalUrl = "http://"+myPhoneIP+":12012"+res[i].originalUrl;
          }
          _this.setState({musicData: res});
        } catch (e) {
          console.log("get musics error!");
        }
      }
    });
  },
  handleDialogClose: function() {
    // this.refs.phoneMusicPlay.handleEnd();
    this.refs.phoneMusicPlay.resetCurrentTrack();
  },
  handlePlay: function(music) {
    // var {musicPlayList} = this.state;
    // musicPlayList.push(music);
    // this.setState({ musicPlayList });
    // showMetroDialog('#audioDialog');
    var dialog = $("#audioDialog").data('dialog');
    dialog.open();
    // this.refs.phoneMusicPlay.handlePlay();
    for(var i = 0; i < this.state.musicData.length; i++) {
      if(this.state.musicData[i] == music) {
        this.refs.phoneMusicPlay.selectPlay(i);
      }
    }
    dialog.options.onDialogClose = this.handleDialogClose;
  }
});

// module.exports = PhoneMusicView;
function mapStateToProps(state){
  const { windowSizeChange, myPhoneIP } = state.homeReducer;
  return {
    windowSizeChange,
    myPhoneIP
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
)(PhoneMusicView);
