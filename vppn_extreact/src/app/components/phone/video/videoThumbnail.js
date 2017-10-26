import React,{Component} from 'react';

class VideoThumbnail extends Component{

  handleDblClickVideo = (e)=>{
    this.props.handleDblClickVideo(e);
  }
  render(){
    var {videoData} = this.props;
    var VideoItems = videoData.albumVideos.map(function(video, i){
      return (
        <div id={"phoneVideo_"+videoData.albumName+"_"+i} key={i} className="list" onDoubleClick={this.handleDblClickVideo}>
          <img src={video.thumbnail} className="list-icon"/>
          <span className="list-title">{video.videoUrl.substr(video.videoUrl.lastIndexOf("/")+1)}</span>
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-icons menu-list2" data-role="listview">
        {VideoItems}
      </div>
    )
  }

}

export default VideoThumbnail;