import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { SELECT_SONG } from '../actions'

const Sidebar = ({ className, songs, onSelect }) => (
  <ul className={classnames(className, 'sidebar')}>
    {songs.map(s => (
      <li key={s.title}
        className={classnames('sidebar__item', { 'sidebar__item--selected': s.selected })}
        onClick={() => onSelect(s.title)}>
        {s.title}
      </li>
    ))}
  </ul>
)

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
    songs: state.songs.map(s => Object.assign(s, {
      selected: s.title === state.selectedSong
    }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
