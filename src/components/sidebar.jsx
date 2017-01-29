import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong } from '../actions'
import Icon from './icon'

class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = { search: '' }
    this.handleKeyup = this.handleKeyup.bind(this)
  }

  componentDidMount () {
    if (this.props.selectedSong) {
      document.querySelector('.sidebar__menu-item--selected').scrollIntoView()
    }
    window.addEventListener('keyup', this.handleKeyup)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyup)
  }

  handleKeyup (e) {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
    switch (e.which) {
      case 83:
        this.refs.searchInput.focus()
        break
    }
  }

  filterSongs () {
    if (this.state.search === '') return this.props.songs
    let pattern = new RegExp(`${this.state.search}`, 'i')
    return this.props.songs.filter(s => pattern.test(s.title))
  }

  classNames (classNames) {
    return classnames(classNames, this.props.className, {
      'sidebar--collapsed': !this.props.visible
    })
  }

  itemClassNames (title) {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === this.props.selectedSong.title
    })
  }

  render () {
    return (
      <div className={this.classNames('sidebar u-flex u-flex--vertical')}>
        <div className='sidebar__search u-flex__panel'>
          <input ref='searchInput'
            type='text'
            placeholder='Search'
            className='sidebar__search-field field__input'
            value={this.state.search}
            onChange={(e) => this.setState({ search: e.target.value })} />
          <Icon icon='search' className='sidebar__icon sidebar__search-icon' />
          <Icon icon='close'
            className='sidebar__icon sidebar__close-icon'
            style={{ display: this.state.search === '' ? 'none' : 'block' }}
            onClick={() => this.setState({ search: '' })} />
        </div>
        <ul className='sidebar__menu u-flex__panel u-flex__panel--grow'>
          {this.filterSongs().map(s => (
            <li key={s.title}
              className={this.itemClassNames(s.title)}
              onClick={() => this.props.onSelect(s.title)}>
              {s.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (title) => dispatch(selectSong(title))
  }
}

function mapStateToProps (state) {
  return {
    selectedSong: state.selectedSong,
    songs: state.songs,
    visible: state.ui.sidebarVisible
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
