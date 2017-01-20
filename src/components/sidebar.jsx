import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong } from '../actions'

const Sidebar = ({ className, songs, selectedSong, onSelect }) => (
  <ul className={classnames(className, 'sidebar')}>
    {songs.map(s => (
      <li key={s.title}
        className={itemClassNames(s.title, s.title === selectedSong.title)}
        onClick={() => onSelect(s.title)}>
        {s.title}
      </li>
    ))}
  </ul>
)

function itemClassNames (title, selected) {
  return classnames('sidebar__item', { 'sidebar__item--selected': selected })
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (title) => dispatch(selectSong(title))
  }
}

function mapStateToProps (state) {
  return {
    selectedSong: state.selectedSong,
    songs: state.songs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
