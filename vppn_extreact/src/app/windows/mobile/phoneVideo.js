var React = require('react');
var ReactDOM = require('react-dom');
const Utils = require('../../script/utils');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../../actions/home_action';
import VideoTable from '../../components/phone/video/videoTable';
import VideoList from '../../components/phone/video/videoList';
import VideoThumbnail from '../../components/phone/video/videoThumbnail';

// import { default as Video, Controls, Play, Mute, Seek, Fullscreen, Time, Overlay } from 'react-html5video';

// var videoData = [
//   {
//     albumName: "相机",
//     coverUrl: "http://vjs.zencdn.net/v/oceans.png",
//     albumVideos: [
//       {
//         videoUrl: 'http://vjs.zencdn.net/v/oceans.mp4',
//         thumbnail: 'http://vjs.zencdn.net/v/oceans.png',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/2.jpg',
//         thumbnail: 'images/2.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/3.jpg',
//         thumbnail: 'images/3.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/4.jpg',
//         thumbnail: 'images/4.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/5.jpg',
//         thumbnail: 'images/5.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   },
//   {
//     albumName: "其他",
//     coverUrl: "images/jek_vorobey.jpg",
//     albumVideos: [
//       {
//         videoUrl: 'images/jek_vorobey.jpg',
//         thumbnail: 'images/jek_vorobey.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/jeki_chan.jpg',
//         thumbnail: 'images/jeki_chan.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/jolie.jpg',
//         thumbnail: 'images/jolie.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/me.jpg',
//         thumbnail: 'images/me.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/shvarcenegger.jpg',
//         thumbnail: 'images/shvarcenegger.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/spface.jpg',
//         thumbnail: 'images/spface.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       },
//       {
//         videoUrl: 'images/vin_d.jpg',
//         thumbnail: 'images/vin_d.jpg',
//         duration: '00:00:32',
//         size: '64.8 MB',
//         format: 'mp4',
//         modifyDate: '08/24/2016 14:52'
//       }
//     ]
//   }
// ]

var setWinHeight = function(id, width, height){
  var windowId = '#window-' + id;
  // var height = $(windowId).height();
  // var width = $(windowId).width();
  var headerHeight = 38;  //49
  $(windowId + ' .sidebar3').css("height", height - headerHeight - 30);
  $(windowId + ' .wi-right').css("height", height - headerHeight);
  $(windowId + ' .wi-right-1').css("height", height - headerHeight - 30 - 44);
  $(windowId + ' .videoTable_body').css("height", height - headerHeight - 30 - 44 - 35);
}

var uuid = 0;
var timer = null;
var PhoneVideo = React.createClass({
  getInitialState: function () {
    return {
      menuStatus: 3,
      videoData: [],
      videoUrl: ""
    };
  },
  componentDidMount: function(){
    uuid = Utils.generateUuid(32);
    // var windowId = '#window-' + this.props.id;
    var phoneVideoWindow = this.props.manager.get('phone_video');
    setWinHeight(this.props.id, phoneVideoWindow.width, phoneVideoWindow.height);
    // document.addEventListener('mousemove', this.handleMouseMove);
    this.getVideos();

    timer = setInterval(function(){
      if(this.props.windowSizeChange.flag && this.props.windowSizeChange.windowId=='phone_video') {
        var phoneVideoWindow = this.props.manager.get('phone_video');
        setWinHeight(this.props.id, phoneVideoWindow.width, phoneVideoWindow.height);
        var phoneVideoPlayer = videojs('phone_video_player_'+uuid);
        phoneVideoPlayer.pause();
        phoneVideoPlayer.hide();
        hideMetroDialog('#phoneVideoDialog');
        this.setState({videoUrl: ""});
      }
    }.bind(this), 10);
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   var cl = $("#window-" + this.props.id);
  //   if(cl.hasClass('active') && nextProps.windowSizeChange) {
  //     var phoneVideoPlayer = videojs('phone_video_player_'+uuid);
  //     phoneVideoPlayer.pause();
  //     phoneVideoPlayer.hide();
  //     // $('#phone_video_player.vjs-has-started .vjs-control-bar').css("visibility", "collapse");
  //     // $('#phone_video_player.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar').css("visibility", "collapse");
  //     hideMetroDialog('#phoneVideoDialog');
  //     // this.refs.video.pause();
  //     this.setState({videoUrl: ""});
  //     // var phoneVideoWindow = this.props.manager.get('phone_video');
  //     // setWinHeight(this.props.id, phoneVideoWindow.width, phoneVideoWindow.height);
  //     this.props.actions.setWindowSizeChange(false);
  //   }
  //   return true;
  // },
  componentDidUpdate: function() {
    var cl = $("#window-" + this.props.id);
    if(cl.hasClass('active')) {
      var phoneVideoWindow = this.props.manager.get('phone_video');
      setWinHeight(this.props.id, phoneVideoWindow.width, phoneVideoWindow.height);
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
  //     // setWinHeight(this.props.id);
  //     var phoneVideoWindow = this.props.manager.get('phone_video');
  //     setWinHeight(this.props.id, phoneVideoWindow.width, phoneVideoWindow.height);
  //   }
  // },
  render: function () {
    var phoneVideoSidebar_li = this.state.videoData.map(function (data, i) {
      return (
        <li id={"phoneVideoSidebar_li_"+i} key={"phoneVideoSidebar_li_"+i} className={i==0?"active":""}>
          <span className="mif-play icon"></span>
          <a onClick={this.handleShow.bind(this, i)}>
            <div><img src={data.coverUrl}/></div>
            {data.albumName}({data.albumVideos.length})
          </a>
        </li>
      )
    }, this);

    var phoneVideo_right = this.state.videoData.map(function (data, i) {
      return (
        <div className={"wi"+(i==0?" active":"")} id={"phoneVideo_right_"+i} key={"phoneVideo_right_"+i}>
          <div className="wi-right-1" style={{overflowY:"auto"}}>
            {this._getVideoList(data)}
          </div>
        </div>
      )
    }, this);

    return (
      <div className="grid condensed no-margin net-win" id="phoneVideoWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <ul className="sidebar2 sidebar3 phoneVideo_sidebar">
              {phoneVideoSidebar_li}
            </ul>
          </div>
          <div className="cell colspan3 wi-right">
            <div className="menu-header">
              <div className="p-l-10 menu-group" data-role="group" data-group-type="one-state">
                <button className="button" onClick={this.handleToggleMenu.bind(this, 1)}><span className="mif-menu icon"></span></button>
                <button className="button" onClick={this.handleToggleMenu.bind(this, 2)}><span className="mif-apps icon"></span></button>
                <button className="button active" onClick={this.handleToggleMenu.bind(this, 3)}><span className="mif-widgets icon"></span></button>
              </div>
              <form className="inline place-right" onSubmit={this.handleSearch}>
                <div className="input-control text m-r-10" data-role="input" style={{width:"18rem"}}>
                  <input type="text" placeholder="Search..." ref="searchVideo"/>
                  <button type="submit" className="button"><span className="mif-search icon"></span></button>
                </div>
              </form>
            </div>
            {phoneVideo_right}
          </div>
        </div>
        <div data-role="dialog" id="phoneVideoDialog" className="padding20 dialog" style={{position:"absolute"}}>
          <div className="main_video">
            {/*<Video
              controls
              autoPlay
              ref="video">
                <source src={this.state.videoUrl} type="video/mp4" />
                <Overlay />
                <Controls>
                    <Play />
                    <Seek />
                    <Time />
                    <Mute />
                    <Fullscreen/>
                </Controls>
            </Video>*/}
            <video id={"phone_video_player_"+uuid} className="video-js" controls preload="auto" data-setup="{}">
              <source src={this.state.videoUrl} type='video/mp4'/>
            </video>
          </div>
          <span className="dialog-close-button" onClick={this.handleCloseDialog}/>
        </div>
      </div>
    );
  },
  _getVideoList: function(videoData){
    switch (this.state.menuStatus) {
      case 1:
        return <VideoTable videoData={videoData} handleDblClickVideo={this.handleDblClickVideo} />
        break;
      case 2:
        return <VideoList videoData={videoData} handleDblClickVideo={this.handleDblClickVideo} />
        break;
      case 3:
        return <VideoThumbnail videoData={videoData} handleDblClickVideo={this.handleDblClickVideo} />
        break;
      default:
        break;
    }
  },
  handleShow: function(key, e){
    $('#phoneVideoWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#phoneVideoWindow .sidebar3 li').each(function(){
      $(this).removeClass('active');
    })
    $('#phoneVideoSidebar_li_' + key).addClass('active');
    $('#phoneVideo_right_' + key).addClass('active');
  },
  handleToggleMenu: function(key) {
    this.setState({menuStatus: key});
  },
  handleSearch: function(e){
    e.preventDefault();
  },
  getVideos: function(){
    const { myPhoneIP } = this.props;
    var _this = this;
    $.ajax({
      type: "GET",
      async: true,
      url: "http://"+myPhoneIP+":12012/video",
      dataType: "json",
      cache:false,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          for(var i = 0; i < res.length; i++) {
            res[i].coverUrl = "http://"+myPhoneIP+":12012"+res[i].coverUrl;
            for(var j = 0; j < res[i].albumVideos.length; j++) {
              res[i].albumVideos[j].videoUrl = "http://"+myPhoneIP+":12012"+res[i].albumVideos[j].videoUrl;
              res[i].albumVideos[j].thumbnail = "http://"+myPhoneIP+":12012"+res[i].albumVideos[j].thumbnail;
            }
          }
          _this.setState({videoData: res});
        } catch (e) {
          console.log("get videos error!");
        }
      }
    });
  },
  handleMousedownVideo: function(e) {
    $("#phoneVideoWindow .wi-right-1 .phone_video").removeClass("video_focus");
		$("#"+e.currentTarget.id).addClass("video_focus");
  },
  resizeVideoDialog: function() {
    var windowId = '#window-' + this.props.id;
    var windowHeight = $(windowId).height();
    var windowWidth = $(windowId).width();
    var height = $(windowId + ' .wi-right').height();
    var width = $(windowId + ' .wi-right').width();
    // var el = ReactDOM.findDOMNode(this.refs.video).getElementsByTagName('video')[0];
    // var fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
    setTimeout(function(){
      $(windowId + ' .main_video').css("width", width + "px");
      $(windowId + ' .main_video').css("height", height - 40 + "px");
      $('#phone_video_player_'+uuid).css("width", width + "px");
      $('#phone_video_player_'+uuid).css("height", height - 40 + "px");
      $('#phoneVideoDialog').css("left", (windowWidth-width)/2 + "px");
      $('#phoneVideoDialog').css("top", "0px");
    }, 100);
  },
  handleDblClickVideo: function(e) {
    var videoId = e.currentTarget.id;
    setTimeout(function(){
      showMetroDialog('#phoneVideoDialog');
      for(var i = 0; i < this.state.videoData.length; i++) {
        if(this.state.videoData[i].albumName == videoId.substring(videoId.indexOf("_")+1, videoId.lastIndexOf("_"))) {
          this.setState({videoUrl: this.state.videoData[i].albumVideos[parseInt(videoId.substr(videoId.lastIndexOf("_")+1))].videoUrl});
          break;
        }
      }
      // this.setState({videoUrl: "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov"});
      // this.refs.video.load();
      // this.refs.video.play();
      var phoneVideoPlayer = videojs('phone_video_player_'+uuid);
      phoneVideoPlayer.show();
      phoneVideoPlayer.load();
      phoneVideoPlayer.play();
      // $('#phone_video_player.vjs-has-started .vjs-control-bar').css("visibility", "visible");
      // $('#phone_video_player.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar').css("visibility", "visible");
    }.bind(this), 100);
    this.resizeVideoDialog();
  },
  handleCloseDialog: function() {
    var phoneVideoPlayer = videojs('phone_video_player_'+uuid);
    phoneVideoPlayer.pause();
    phoneVideoPlayer.hide();
    // $('#phone_video_player.vjs-has-started .vjs-control-bar').css("visibility", "collapse");
    // $('#phone_video_player.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar').css("visibility", "collapse");
    hideMetroDialog('#phoneVideoDialog');
  }
});

// module.exports = PhoneVideo;
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
)(PhoneVideo);