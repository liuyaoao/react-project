var React = require('react');

var MusicThumbnail = React.createClass({
  render: function(){
    var {musicData} = this.props;
    var MusicItems = musicData.map(function(music, i){
      return (
        <div key={i} className="list" onDoubleClick={this.handlleDbClick.bind(this, music)}>
          <span className="mif-file-music list-icon" style={{color:"#59cde2"}}></span>
          <div className="list-content">
            <span className="list-title no-margin-top" title={music.label}>{music.label}</span>
          </div>
        </div>
      )
    }.bind(this))
    return (
      <div className="listview list-type-icons menu-list2" data-role="listview">
        {MusicItems}
      </div>
    )
  },
  handlleDbClick: function(music) {
    this.props.handlePlay(music);
  }
});

module.exports = MusicThumbnail;
