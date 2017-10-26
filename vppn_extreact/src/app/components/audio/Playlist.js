import React, { Component, PropTypes } from 'react'

var Playlist = React.createClass({
  _handleTrackClick(track) {
    this.props.onTrackClick(track)
  },

  render() {
    const { tracks, currentTrack } = this.props
    return (
      <aside className="media-playlist">
        <header className="media-playlist-header">
          <h3 className="media-playlist-title">Play List</h3>
        </header>
        <ul className="media-playlist-tracks" style={{maxHeight:"400px", overflowY:"auto"}}>
          {tracks.map((track, i) =>
            <li
              key={i}
              className={`media-playlist-track ${track === currentTrack ? 'is-active' : ''}`}
              onClick={this._handleTrackClick.bind(this, track)}
            >
              {track.label}
            </li>
          )}
        </ul>
      </aside>
    )
  }
})

export default Playlist
