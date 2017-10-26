var React = require('react');

var MusicList = React.createClass({
  render: function(){
    var {musicData} = this.props;
    var MusicItems = musicData.map(function(music, i){
      return (
        <div key={i} className="list" onDoubleClick={this.handlleDbClick.bind(this, music)}>
          <span className="mif-file-music list-icon" style={{color:"#59cde2"}}></span>
          <div className="list-content">
            <span className="list-title no-margin-top" title={music.label}>{music.label}</span>
            <span className="list-subtitle">{music.artist}</span>
            <span className="list-remark">{music.album}</span>
          </div>
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-tiles menu-list" data-role="listview">
        {MusicItems}
      </div>
    )
  },
  handlleDbClick: function(music) {
    this.props.handlePlay(music);
  }
});

module.exports = MusicList;
