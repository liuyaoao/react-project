var React = require('react');
var Utils = require('../../../script/utils');

var FileThumbnail = React.createClass({
  render: function(){
    var {fileData} = this.props;
    var FileItems = fileData.map(function(file, i){
      var time = Utils.formatDateTimeString(file.date);
      var iconType = Utils.getFileIcon(file.type);
      return (
        <div key={i} className="list">
          <span className={"mif-"+ iconType +" list-icon"} style={{color:"#59cde2"}}></span>
          <div className="list-content">
            <span className="list-title no-margin-top" title={file.name}>{file.name}</span>
          </div>
        </div>
      )
    })
    return (
      <div className="listview list-type-icons menu-list2" data-role="listview">
        {FileItems}
      </div>
    )
  }
});

module.exports = FileThumbnail;
