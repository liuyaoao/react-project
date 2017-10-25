var React = require('react');

var PhotoList = React.createClass({
  render: function(){
    var {photoData} = this.props;
    var PhotoItems = photoData.albumPhotos.map(function(photo, i){
      return (
        <div id={"phonePhoto_"+photoData.albumName+"_"+i} key={i} className="list" onDoubleClick={this.handleDblClickPhoto}>
          <span className="mif-file-image list-icon" style={{color:"#59cde2"}}></span>
          <span className="list-title">{photo.original.substr(photo.original.lastIndexOf("/")+1)}</span>
          {/*<div className="list-content">
            <span className="list-title no-margin-top">{photo.name}</span>
            <span className="list-subtitle">{photo.performer}</span>
            <span className="list-remark">{photo.album}</span>
          </div>*/}
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-tiles" data-role="listview">
        {PhotoItems}
      </div>
    )
  },
  handleDblClickPhoto: function(e) {
    this.props.handleDblClickPhoto(e);
  }
});

module.exports = PhotoList;
