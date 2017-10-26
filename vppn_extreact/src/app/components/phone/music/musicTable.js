var React = require('react');

var MusicTable = React.createClass({
  render: function(){
    var {musicData} = this.props;
    var MusicItems = musicData.map(function(music, i){
      return (
        <tr key={i} onDoubleClick={this.handlleDbClick.bind(this, music)}>
          <td className="no-padding-left" title={music.label}><span className="mif-file-music icon p-l-5" style={{color:"#59cde2"}}></span> {music.label}</td>
          <td width="80">{music.duration}</td>
          <td width="120">{music.artist}</td>
          <td width="120">{music.album}</td>
          <td width="80">{music.size}</td>
          <td width="150">{music.modifyDate}</td>
        </tr>
      )
    }.bind(this))
    return (
      // <div ref="musicTable">
      //   <table className="table hovered no-margin view-table">
      //     <thead ref="musicTable_head">
      //       <tr>
      //         <th>Name</th>
      //         <th width="60">Duration</th>
      //         <th width="120">Artist</th>
      //         <th width="120">Album</th>
      //         <th width="80">Size</th>
      //         <th width="150">Modify Date</th>
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {MusicItems}
      //     </tbody>
      //   </table>
      // </div>
      <div>
        <div>
          <table className="table hovered no-margin view-table">
            <thead>
              <tr>
                <th>Name</th>
                <th width="80">Duration</th>
                <th width="120">Artist</th>
                <th width="120">Album</th>
                <th width="80">Size</th>
                <th width="150">Modify Date</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="musicTable_body" style={{overflow:"overlay"}}>
          <table className="table hovered no-margin view-table">
            <tbody>
              {MusicItems}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  handlleDbClick: function(music) {
    this.props.handlePlay(music);
  }
});

module.exports = MusicTable;
