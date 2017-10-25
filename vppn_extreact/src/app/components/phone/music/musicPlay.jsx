var React = require('react');
var AudioPlayer = require('../../common/audioplayer');

var playlist = [
        {
          url: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/secret_of_trash_island.mp3',
          displayText: 'Trash Island'
        },
        {
          url: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/marty_mcpaper_theme.mp3',
          displayText: 'Marty McPaper'
        },
        {
          url: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/in_the_hall_of_the_mountain_king.mp3',
          displayText: 'Mountain King'
        }
      ];

var MusicPlay = React.createClass({
  getInitialState: function() {
    return {
      audioElement: null
    }
  },
  render: function(){
    // var {playlist} = this.props;
    return (
      <AudioPlayer playlist={playlist} audioElementRef={this.audioElement}/>
    )
  },
  audioElement: function(elem){
    // console.log(elem);
    this.setState({audioElement: elem})
  },
  handlePlay: function() {
    var {audioElement} = this.state;
    audioElement.play();
  },
  handleEnd: function() {
    var {audioElement} = this.state;
    audioElement.pause();
    audioElement.currentTime = 0;
  },
});

module.exports = MusicPlay;
