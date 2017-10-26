import React,{Component} from 'react';

class VideoTable extends Component{

  handleDblClickVideo = (e)=>{
    this.props.handleDblClickVideo(e);
  }
  render(){
    var {videoData} = this.props;
    var VideoItems = videoData.albumVideos.map(function(video, i){
      return (
        <tr id={"phoneVideo_"+videoData.albumName+"_"+i} key={i} onDoubleClick={this.handleDblClickVideo}>
          <td className="no-padding-left"><span className="mif-file-video icon p-l-5" style={{color:"#59cde2"}}></span> {video.videoUrl.substr(video.videoUrl.lastIndexOf("/")+1)}</td>
          <td>{video.duration}</td>
          <td>{video.size}</td>
          <td>{video.format}</td>
          <td>{video.modifyDate}</td>
        </tr>
      )
    }.bind(this))
    return (
      // <table className="table hovered no-margin view-table">
      //   <thead>
      //     <tr>
      //       <th>Name</th>
      //       <th>Duration</th>
      //       <th>Size</th>
      //       <th>Format</th>
      //       <th>Modify Date</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {VideoItems}
      //   </tbody>
      // </table>
      <div>
        <div>
          <table className="table hovered no-margin view-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th>Size</th>
                <th>Format</th>
                <th>Modify Date</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="videoTable_body" style={{overflow:"overlay"}}>
          <table className="table hovered no-margin view-table">
            <tbody>
              {VideoItems}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default VideoTable;
