import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import { remote } from 'electron'

import {
  selectSong, resizeSidebar, toggleSidebar,
  selectPlaylist, addToPlaylist, removeFromPlaylist
} from '../actions'
import Icon from './icon'
import Resizer from './resizer'
import Modal from './modal'
import KeyCapture from '../key_capture'

type SidebarProps = {
  className: string
  visible: boolean
  width: number
  songs: Resource[]
  selectedSongTitle: string
  selectedPlaylist: string
  playlists: PlaylistCollection
  onToggle: () => void
  onSelect: (song: string) => void
  onResize: (width: number) => void
  onPlaylistSelect: (song: string) => void
  onPlaylistAdd: (playlist: string, song: string) => void
  onPlaylistRemove: (playlist: string, song: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  visible,
  width,
  songs,
  selectedSongTitle,
  selectedPlaylist,
  playlists,
  onToggle,
  onSelect,
  onResize,
  onPlaylistSelect,
  onPlaylistAdd,
  onPlaylistRemove
}) => {
  const toggleKeyCapture = useRef<KeyCapture>(null)
  const searchingKeyCapture = useRef<KeyCapture>(null)
  const sidebar = useRef<HTMLDivElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const songList = useRef<HTMLUListElement>(null)
  const songRefs = useRef<HTMLLIElement[]>([])

  const [search, setSearch] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  // FIXME: where is searching used?
  const [searching, setSearching] = useState(false)
  const [newPlaylistLabel, setNewPlaylistLabel] = useState('')
  const [songToAdd, setSongToAdd] = useState('')

  // FIXME: doesn't work because of deps
  useEffect(() => {
    toggleKeyCapture.current = new KeyCapture({
      's': () => {
        if (!visible) onToggle()
        searchInput.current.select()
      }
    })
    toggleKeyCapture.current.activate()

    return () => toggleKeyCapture.current.deactivate()
  }, [])

  // FIXME: doesn't work because of deps
  useEffect(() => {
    searchingKeyCapture.current = new KeyCapture({
      'Enter': () => {
        if (highlighted > -1) {
          onSelect(filterSongs()[highlighted].title)
          searchInput.current.blur()
        }
      },
      'Escape': () => searchInput.current.blur(),
      'ArrowUp': () => updateHighlighted(highlighted - 1),
      'ArrowDown': () => updateHighlighted(highlighted + 1)
    })

    return () => searchingKeyCapture.current.deactivate()
  }, [])

  useEffect(() => {
    sidebar.current.addEventListener('transitionend', () => {
      window.dispatchEvent(new UIEvent('resize'))
    })

  }, [sidebar])

  useEffect(() => {
    if (selectedSongTitle) {
      const selectedItem = document.querySelector('.sidebar__menu-item--selected')
      selectedItem && selectedItem.scrollIntoView()
    }
  }, [])

  // componentDidUpdate (prevProps: SidebarProps, prevState: SidebarState) {
  //   if (this.state.highlighted > -1 && prevState.highlighted !== this.state.highlighted) {
  //     const highlightedElement = this.songRefs[this.state.highlighted]
  //     const listRect = this.songList.current!.getBoundingClientRect()
  //     const itemRect = highlightedElement.getBoundingClientRect()
  //     if (itemRect.bottom > listRect.bottom) {
  //       highlightedElement.scrollIntoView(false)
  //     } else if (itemRect.top < listRect.top) {
  //       highlightedElement.scrollIntoView(true)
  //     }
  //   }
  // }

  const filterSongs = useCallback(() => {
    if (selectedPlaylist !== '') {
      const playlist = playlists[selectedPlaylist]
      songs = songs.filter(s => playlist.includes(s.title))
    }
    if (search === '') return songs
    const searchString = search.toLowerCase()
    return songs.filter(s => {
      return s.title.toLowerCase().includes(searchString)
    })
  }, [selectedPlaylist, songs, playlists, search])

  const updateHighlighted = useCallback((value: number) => {
    const listLength = filterSongs().length
    if (value < 0) {
      value = listLength - 1
    } else if (value >= listLength) {
      value = 0
    }
    setHighlighted(value)
  }, [filterSongs])

  const startSearch = useCallback(() => {
    setSearching(true)
    setHighlighted(filterSongs().findIndex(s => s.title === selectedSongTitle))
    searchingKeyCapture.current.activate()
  }, [selectedSongTitle])

  const stopSearch = useCallback(() => {
    setSearching(false)
    setHighlighted(-1)
    searchingKeyCapture.current.deactivate()
  }, [])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setHighlighted(-1)
  }, [])

  const handlePlaylistSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    stopSearch()
    onPlaylistSelect(e.target.value)
    setSearch('')
  }, [stopSearch, onPlaylistSelect])

  // popupMenu (title: string) {
  //   const template: Electron.MenuItemConstructorOptions[] = [{
  //     label: 'Add to new playlist',
  //     click: () => {
  //       this.setState({ songToAdd: title })
  //     }
  //   }]

  //   const playlistLabels = Object.keys(playlists)

  //   if (playlistLabels.length) {
  //     template.push({ type: 'separator' })
  //     playlistLabels.forEach(playlist => {
  //       const inPlaylist = playlists[playlist].includes(title)
  //       template.push({
  //         label: inPlaylist ? `Remove from "${playlist}"` : `Add to "${playlist}"`,
  //         type: 'checkbox',
  //         checked: inPlaylist,
  //         click: () => {
  //           if (inPlaylist) {
  //             onPlaylistRemove(playlist, title)
  //           } else {
  //             onPlaylistAdd(playlist, title)
  //           }
  //         }
  //       })
  //     })
  //   }

  //   // FIXME: find alternative to remote
  //   // remote.Menu.buildFromTemplate(template).popup({})
  // }

  const resetNewplaylist = useCallback(() => {
    setNewPlaylistLabel('')
    setSongToAdd('')
  }, [])

  const createPlaylist = useCallback(() => {
    onPlaylistAdd(newPlaylistLabel, songToAdd)
    resetNewplaylist()
  }, [newPlaylistLabel, songToAdd, onPlaylistAdd, resetNewplaylist])

  const renderNewPlaylistPanel = useCallback(() => (
    <Modal open={!!songToAdd}
      title='New playlist'
      buttonLabel='Create playlist'
      onSubmit={createPlaylist}
      onCancel={resetNewplaylist}>
      <label className='field'>
        <input type='text'
          className='field__input'
          value={newPlaylistLabel}
          required
          autoFocus
          onChange={(e) => setNewPlaylistLabel(e.target.value)} />
        <span className='field__label'>Playlist name</span>
      </label>
    </Modal>
  ), [songToAdd, newPlaylistLabel, createPlaylist, resetNewplaylist])

  const classNames = useCallback((classNames: string) => {
    return classnames(classNames, className, {
      'sidebar--collapsed': !visible
    })
  }, [visible, className])

  const itemClassNames = useCallback((title: string, index: number) => {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === selectedSongTitle,
      'sidebar__menu-item--highlighted': index === highlighted
    })
  }, [selectedSongTitle, highlighted])

  return (
    <div ref={sidebar}
      className={classNames('sidebar')}
      style={{ width: (visible && width) || 0 }}>
      <div className='sidebar__inner u-flex u-flex--vertical'
        style={{ width: width }}>
        <div className='sidebar__search u-flex__panel'>
          <input ref={searchInput}
            type='text'
            placeholder='Search'
            className='sidebar__search-field field__input'
            value={search}
            onFocus={startSearch}
            onBlur={stopSearch}
            onChange={handleSearch} />
          <Icon icon='search' className='sidebar__icon sidebar__search-icon' />
          <Icon icon='close'
            className='sidebar__icon sidebar__close-icon'
            style={{ display: search === '' ? 'none' : 'block' }}
            onClick={() => setSearch('')} />
        </div>
        <ul ref={songList}
          className='sidebar__menu u-flex__panel u-flex__panel--grow'>
          {filterSongs().map((s, i) => (
            <li key={s.title}
              ref={(el) => songRefs.current[i] = el}
              className={itemClassNames(s.title, i)}
              onClick={() => onSelect(s.title)}
              // onContextMenu={() => this.popupMenu(s.title)}
            >
              {s.title}
            </li>
          ))}
        </ul>
        <div className='sidebar__playlist-selector theme--dark u-flex__panel'>
          <label className='field field--dropdown'>
            <select className='field__input field__input--select'
              value={selectedPlaylist}
              onChange={handlePlaylistSelect}>
              <option value=''>All songs</option>
              {Object.keys(playlists).map((p, i) => (
                <option key={i}>{p}</option>
              ))}
            </select>
            <Icon className='field__icon' icon='arrow_drop_down' />
          </label>
        </div>
      </div>
      {renderNewPlaylistPanel()}
      <Resizer className='sidebar__resizer'
        onResize={onResize} />
    </div>
  )
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch(toggleSidebar()),
    onSelect: (title: string) => dispatch(selectSong(title)),
    onResize: (width: number) => dispatch(resizeSidebar(width)),
    onPlaylistSelect: (playlist: string) => dispatch(selectPlaylist(playlist)),
    onPlaylistAdd: (playlist: string, song: string) => dispatch(addToPlaylist(playlist, song)),
    onPlaylistRemove: (playlist: string, song: string) => dispatch(removeFromPlaylist(playlist, song))
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
