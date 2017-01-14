import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

class SongList extends React.Component {
  render () {
    return (
      <ul className={classnames(this.props.className, 'song-list')}>
        {this.props.songs.map(r => (
          <li key={r.title} onSelect={() => this.props.onSelect(r.title)}>
            {r.title}
          </li>
        ))}
      </ul>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (title) => dispatch({
      type: SELECT_SONG,
      payload: title
    })
  }
}

function mapStateToProps (state) {
  return {
    songs: state.resources
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SongList)
