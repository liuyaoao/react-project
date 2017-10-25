var React = require('react');

var PhotoTable = React.createClass({
  render: function(){
    var {photoData} = this.props;
    var PhotoItems = photoData.albumPhotos.map(function(photo, i){
      return (
        <tr id={"phonePhoto_"+photoData.albumName+"_"+i} key={i} onDoubleClick={this.handleDblClickPhoto}>
          <td className="no-padding-left"><span className="mif-file-image icon p-l-5" style={{color:"#59cde2"}}></span> {photo.original.substr(photo.original.lastIndexOf("/")+1)}</td>
          <td>{photo.size}</td>
          <td>{photo.format}</td>
          <td>{photo.modifyDate}</td>
        </tr>
      )
    }.bind(this))
    return (
      // <table className="table hovered no-margin view-table">
      //   <thead>
      //     <tr>
      //       <th>Name</th>
      //       <th>Size</th>
      //       <th>Format</th>
      //       <th>Modify Date</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {PhotoItems}
      //   </tbody>
      // </table>
      <div>
        <div>
          <table className="table hovered no-margin view-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Format</th>
                <th>Modify Date</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="photoTable_body" style={{overflow:"overlay"}}>
          <table className="table hovered no-margin view-table">
            <tbody>
              {PhotoItems}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  handleDblClickPhoto: function(e) {
    this.props.handleDblClickPhoto(e);
  }
});

module.exports = PhotoTable;
