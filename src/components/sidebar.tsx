import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { remote } from 'electron'

import {
  selectSong, RESIZE_SIDEBAR, TOGGLE_SIDEBAR,
  SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST
} from '../actions'
import Icon from './icon'
import Resizer from './resizer'
import Modal from './modal'
import KeyCapture from '../key_capture'

interface SidebarProps {
  readonly className: string
  readonly visible: boolean
  readonly width: number
  readonly songs: Resource[]
  readonly selectedSongTitle: string
  readonly selectedPlaylist: string
  readonly playlists: PlaylistCollection
  readonly onToggle: () => void
  readonly onSelect: (song: string) => void
  readonly onResize: (width: number) => void
  readonly onPlaylistSelect: (song: string) => void
  readonly onPlaylistAdd: (playlist: string, song: string) => void
  readonly onPlaylistRemove: (playlist: string, song: string) => void
}

interface SidebarState {
  readonly search: string
  readonly highlighted: number
  readonly searching: boolean
  readonly newPlaylistLabel: string
  readonly songToAdd: string
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  private toggleKeyCapture: KeyCapture
  private searchingKeyCapture: KeyCapture
  private sidebar = React.createRef<HTMLDivElement>()
  private searchInput = React.createRef<HTMLInputElement>()
  private songList = React.createRef<HTMLUListElement>()
  private songRefs: HTMLLIElement[] = []

  constructor (props: SidebarProps) {
    super(props)

    this.state = {
      search: '',
      highlighted: -1,
      searching: false,
      newPlaylistLabel: '',
      songToAdd: ''
    }

    this.toggleKeyCapture = new KeyCapture({
      's': () => {
        if (!this.props.visible) this.props.onToggle()
        this.searchInput.current!.select()
      }
    })

    this.searchingKeyCapture = new KeyCapture({
      'Enter': () => {
        if (this.state.highlighted > -1) {
          this.props.onSelect(this.filterSongs()[this.state.highlighted].title)
          this.searchInput.current!.blur()
        }
      },
      'Escape': () => this.searchInput.current!.blur(),
      'ArrowUp': () => this.updateHighlighted(this.state.highlighted - 1),
      'ArrowDown': () => this.updateHighlighted(this.state.highlighted + 1)
    })
  }

  componentDidMount () {
    if (this.props.selectedSongTitle) {
      let selectedItem = document.querySelector('.sidebar__menu-item--selected')
      selectedItem && selectedItem.scrollIntoView()
    }
    this.toggleKeyCapture.activate()
    this.sidebar.current!.addEventListener('transitionend', () => {
      window.dispatchEvent(new UIEvent('resize'))
    })
  }

  componentWillUnmount () {
    this.toggleKeyCapture.deactivate()
    this.searchingKeyCapture.deactivate()
  }

  componentDidUpdate (prevProps: SidebarProps, prevState: SidebarState) {
    if (this.state.highlighted > -1 && prevState.highlighted !== this.state.highlighted) {
      let highlightedElement = this.songRefs[this.state.highlighted]
      let listRect = this.songList.current!.getBoundingClientRect()
      let itemRect = highlightedElement.getBoundingClientRect()
      if (itemRect.bottom > listRect.bottom) {
        highlightedElement.scrollIntoView(false)
      } else if (itemRect.top < listRect.top) {
        highlightedElement.scrollIntoView(true)
      }
    }
  }

  updateHighlighted (value: number) {
    let listLength = this.filterSongs().length
    if (value < 0) {
      value = listLength - 1
    } else if (value >= listLength) {
      value = 0
    }
    this.setState({ highlighted: value })
  }

  filterSongs () {
    let songs = this.props.songs
    if (this.props.selectedPlaylist !== '') {
      let playlist = this.props.playlists[this.props.selectedPlaylist]
      songs = this.props.songs.filter(s => playlist.includes(s.title))
    }
    if (this.state.search === '') return songs
    let searchString = this.state.search.toLowerCase()
    return songs.filter(s => {
      return s.title.toLowerCase().includes(searchString)
    })
  }

  startSearch () {
    this.setState({
      searching: true,
      highlighted: this.filterSongs().findIndex(s => s.title === this.props.selectedSongTitle)
    })
    this.searchingKeyCapture.activate()
  }

  stopSearch () {
    this.setState({
      searching: false,
      highlighted: -1
    })
    this.searchingKeyCapture.deactivate()
  }

  handleSearch (e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      search: e.target.value,
      highlighted: -1
    })
  }

  handlePlaylistSelect (e: React.ChangeEvent<HTMLSelectElement>) {
    this.stopSearch()
    this.props.onPlaylistSelect(e.target.value)
    this.setState({ search: '' })
  }

  popupMenu (title: string) {
    let template: Electron.MenuItemConstructorOptions[] = [{
      label: 'Add to new playlist',
      click: () => {
        this.setState({ songToAdd: title })
      }
    }]

    let playlistLabels = Object.keys(this.props.playlists)

    if (playlistLabels.length) {
      template.push({ type: 'separator' })
      playlistLabels.forEach(playlist => {
        let inPlaylist = this.props.playlists[playlist].includes(title)
        template.push({
          label: inPlaylist ? `Remove from "${playlist}"` : `Add to "${playlist}"`,
          type: 'checkbox',
          checked: inPlaylist,
          click: () => {
            if (inPlaylist) {
              this.props.onPlaylistRemove(playlist, title)
            } else {
              this.props.onPlaylistAdd(playlist, title)
            }
          }
        })
      })
    }

    remote.Menu.buildFromTemplate(template).popup({})
  }

  createPlaylist () {
    this.props.onPlaylistAdd(this.state.newPlaylistLabel, this.state.songToAdd)
    this.resetNewplaylist()
  }

  resetNewplaylist () {
    this.setState({
      newPlaylistLabel: '',
      songToAdd: ''
    })
  }

  renderNewPlaylistPanel () {
    return (
      <Modal open={!!this.state.songToAdd}
        title='New playlist'
        buttonLabel='Create playlist'
        onSubmit={this.createPlaylist.bind(this)}
        onCancel={this.resetNewplaylist.bind(this)}>
        <label className='field'>
          <input type='text'
            className='field__input'
            value={this.state.newPlaylistLabel}
            required
            autoFocus
            onChange={(e) => this.setState({ newPlaylistLabel: e.target.value })} />
          <span className='field__label'>Playlist name</span>
        </label>
      </Modal>
    )
  }

  classNames (classNames: string) {
    return classnames(classNames, this.props.className, {
      'sidebar--collapsed': !this.props.visible
    })
  }

  itemClassNames (title: string, index: number) {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === this.props.selectedSongTitle,
      'sidebar__menu-item--highlighted': index === this.state.highlighted
    })
  }

  render () {
    return (
      <div ref={this.sidebar}
        className={this.classNames('sidebar')}
        style={{ width: (this.props.visible && this.props.width) || 0 }}>
        <div className='sidebar__inner u-flex u-flex--vertical'
          style={{ width: this.props.width }}>
          <div className='sidebar__search u-flex__panel'>
            <input ref={this.searchInput}
              type='text'
              placeholder='Search'
              className='sidebar__search-field field__input'
              value={this.state.search}
              onFocus={this.startSearch.bind(this)}
              onBlur={this.stopSearch.bind(this)}
              onChange={this.handleSearch.bind(this)} />
            <Icon icon='search' className='sidebar__icon sidebar__search-icon' />
            <Icon icon='close'
              className='sidebar__icon sidebar__close-icon'
              style={{ display: this.state.search === '' ? 'none' : 'block' }}
              onClick={() => this.setState({ search: '' })} />
          </div>
          <ul ref={this.songList}
            className='sidebar__menu u-flex__panel u-flex__panel--grow'>
            {this.filterSongs().map((s, i) => (
              <li key={s.title}
                ref={(el) => this.songRefs[i] = el!}
                className={this.itemClassNames(s.title, i)}
                onClick={() => this.props.onSelect(s.title)}
                onContextMenu={() => this.popupMenu(s.title)}>
                {s.title}
              </li>
            ))}
          </ul>
          <div className='sidebar__playlist-selector theme--dark u-flex__panel'>
            <label className='field field--dropdown'>
              <select className='field__input field__input--select'
                value={this.props.selectedPlaylist}
                onChange={this.handlePlaylistSelect.bind(this)}>
                <option value=''>All songs</option>
                {Object.keys(this.props.playlists).map((p, i) => (
                  <option key={i}>{p}</option>
                ))}
              </select>
              <Icon className='field__icon' icon='arrow_drop_down' />
            </label>
          </div>
        </div>
        {this.renderNewPlaylistPanel()}
        <Resizer className='sidebar__resizer'
          onResize={this.props.onResize} />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch({ type: TOGGLE_SIDEBAR }),
    onSelect: (title: string) => dispatch(selectSong(title)),
    onResize: (width: number) => dispatch({
      type: RESIZE_SIDEBAR,
      payload: width
    }),
    onPlaylistSelect: (playlist: string) => dispatch({
      type: SELECT_PLAYLIST,
      payload: playlist
    }),
    onPlaylistAdd: (playlist: string, song: string) => dispatch({
      type: ADD_TO_PLAYLIST,
      payload: { playlist, song }
    }),
    onPlaylistRemove: (playlist: string, song: string) => dispatch({
      type: REMOVE_FROM_PLAYLIST,
      payload: { playlist, song }
    })
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    selectedSongTitle: state.selectedSong,
    songs: state.songs,
    playlists: state.playlists.playlists,
    selectedPlaylist: state.playlists.selectedPlaylist,
    visible: state.ui.sidebarVisible,
    width: state.ui.sidebarWidth
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
