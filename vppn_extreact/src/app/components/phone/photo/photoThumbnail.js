import React,{Component} from 'react';

class PhotoThumbnail extends Component{

  handleDblClickPhoto = (e)=>{
    this.props.handleDblClickPhoto(e);
  }
  render(){
    var {photoData} = this.props;
    var PhotoItems = photoData.albumPhotos.map(function(photo, i){
      return (
        <div id={"phonePhoto_"+photoData.albumName+"_"+i} key={i} className="list" onDoubleClick={this.handleDblClickPhoto}>
          <img src={photo.thumbnail} className="list-icon"/>
          <span className="list-title">{photo.original.substr(photo.original.lastIndexOf("/")+1)}</span>
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-icons menu-list2" data-role="listview">
        {PhotoItems}
      </div>
    )
  }

}

export default PhotoThumbnail;