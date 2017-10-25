var React = require('react');
var Utils = require('../../../script/utils');

var FileTable = React.createClass({
  render: function(){
    var {fileData} = this.props;
    var FileItems = fileData.map(function(file, i){
      var time = Utils.formatDateTimeString(file.date);
      var iconType = Utils.getFileIcon(file.type);
      return (
        <tr key={i}>
          <td className="no-padding-left" title={file.name}><span className={"mif-"+ iconType +" icon p-l-5"} style={{color:"#59cde2"}}></span> {file.name}</td>
          <td style={{width:"200px"}}>{time}</td>
          <td>{file.type}</td>
          <td>{file.size}</td>
        </tr>
      )
    })
    return (
      // <table className="table hovered no-margin view-table">
      //   <thead>
      //     <tr>
      //       <th>Name</th>
      //       <th style={{width:"200px"}}>Date</th>
      //       <th>Type</th>
      //       <th>Size</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {FileItems}
      //   </tbody>
      // </table>
      <div>
        <div>
          <table className="table hovered no-margin view-table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{width:"200px"}}>Date</th>
                <th>Type</th>
                <th>Size</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="fileTable_body" style={{overflow:"overlay"}}>
          <table className="table hovered no-margin view-table">
            <tbody>
              {FileItems}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

module.exports = FileTable;
