import React, { Component, PropTypes } from 'react'
import Playlist from './Playlist';
import MediaPlayer from './MediaPlayer';

// const playlist = [
//   { src: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/secret_of_trash_island.mp3', label: 'secret_of_trash_island' },
//   { src: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/marty_mcpaper_theme.mp3', label: 'marty_mcpaper_theme' },
//   { src: 'http://benwiley4000.github.io/react-responsive-audio-player/audio/in_the_hall_of_the_mountain_king.mp3', label: 'in_the_hall_of_the_mountain_king' },
//   // { src: 'https://vimeo.com/channels/staffpicks/150734165', label: 'Lesley (Vimeo)' },
//   // { src: 'http://a1083.phobos.apple.com/us/r1000/014/Music/v4/4e/44/b7/4e44b7dc-aaa2-c63b-fb38-88e1635b5b29/mzaf_1844128138535731917.plus.aac.p.m4a', label: 'iTunes Preview' },
//   // { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', label: 'Big Buck Bunny' },
//   // { src: 'https://vid4u.org/ninja/5/dev/assets/madmax-intro.mp4', label: 'Mad Max Intro' },
//   // { src: 'http://demosthenes.info/assets/videos/mountain.mp4', label: 'Mountain' },
//   // { src: 'http://www.w3schools.com/html/movie.mp4', label: 'Bear' },
//   // { src: 'http://jelmerdemaat.nl/online-demos/conexus/video/small.mp4', label: 'Lego Robot' },
//   // { src: 'http://shapeshed.com/examples/HTML5-video-element/video/320x240.m4v', label: 'iPod Help' },
//   // { src: 'http://html5demos.com/assets/dizzy.mp4', label: 'Dizzy Kitty' },
//   // { src: 'http://www.noiseaddicts.com/samples_1w72b820/3890.mp3', label: 'Noise Addicts' }
// ]
const mod = (num, max) => ((num % max) + max) % max

var MusicPlayer = React.createClass({
  getInitialState: function(){
    return {
      currentTrack: { label: 'No media loaded', originalUrl: null },
      showMediaPlayer: true,
      repeatTrack: true,
      autoPlay: true
    }
  },
  _handleTrackClick: function(track) {
    this.setState({ currentTrack: track })
  },
  _navigatePlaylist: function(direction) {
    const { playlist } = this.props;
    const newIndex = mod(playlist.indexOf(this.state.currentTrack) + direction, playlist.length)
    this.setState({ currentTrack: playlist[newIndex] })
  },
  selectPlay: function(index) {
    const { playlist } = this.props;
    this.setState({ currentTrack: playlist[index] })
  },
  resetCurrentTrack: function() {
    this.setState( { currentTrack: { label: 'No media loaded', originalUrl: null } })
  },

  render() {
    const { playlist } = this.props;
    const { showMediaPlayer, currentTrack, repeatTrack, autoPlay } = this.state
    return (
      <div className="media-player-wrapper no-margin-bottom">
        <MediaPlayer
          ref={c => this._mediaPlayer = c}
          src={currentTrack.originalUrl}
          autoPlay={autoPlay}
          loop={repeatTrack}
          currentTrack={currentTrack.label}
          repeatTrack={repeatTrack}
          onPrevTrack={() => this._navigatePlaylist(-1)}
          onNextTrack={() => this._navigatePlaylist(1)}
          onRepeatTrack={() => { this.setState({ repeatTrack: !repeatTrack }) }}
          onPlay={() => !autoPlay && this.setState({ autoPlay: true })}
          onPause={() => this.setState({ autoPlay: false })}
          onEnded={() => !repeatTrack && this._navigatePlaylist(1)}
        />
        <Playlist
          tracks={playlist}
          currentTrack={currentTrack}
          onTrackClick={this._handleTrackClick}
        />
      </div>
    )
  }
})

export default MusicPlayer
