var React = require('react');

var VideoList = React.createClass({
  render: function(){
    var {videoData} = this.props;
    var VideoItems = videoData.albumVideos.map(function(video, i){
      return (
        <div id={"phoneVideo_"+videoData.albumName+"_"+i} key={i} className="list" onDoubleClick={this.handleDblClickVideo}>
          <span className="mif-file-video list-icon" style={{color:"#59cde2"}}></span>
          <span className="list-title">{video.videoUrl.substr(video.videoUrl.lastIndexOf("/")+1)}</span>
          {/*<div className="list-content">
            <span className="list-title no-margin-top">{video.name}</span>
            <span className="list-subtitle">{video.performer}</span>
            <span className="list-remark">{video.album}</span>
          </div>*/}
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-tiles" data-role="listview">
        {VideoItems}
      </div>
    )
  },
  handleDblClickVideo: function(e) {
    this.props.handleDblClickVideo(e);
  }
});

module.exports = VideoList;
