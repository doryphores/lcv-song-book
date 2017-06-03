import React from 'react'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import Icon from './icon'
import { dismiss, selectSong } from '../actions'

const Notifications = ({ notifications, onDismiss, onView }) => (
  <CSSTransitionGroup component='div'
    className='notification-container'
    transitionName='grow'
    transitionEnterTimeout={200}
    transitionLeaveTimeout={200}>
    {notifications.map(({ id, message, icon, song }) => (
      <div key={id}
        className='notification u-flex u-flex--horizontal'
        onClick={() => onDismiss(id)}>
        <Icon icon={icon} className='notification__icon u-flex__panel' />
        <span className='u-flex__panel u-flex__panel--grow'>
          {message + ' '}
          {song && (
            <span className='notification__song' onClick={() => onView(song)}>
              {song}
            </span>
          )}
        </span>
      </div>
    ))}
  </CSSTransitionGroup>
)

function mapStateToProps ({ notifications }) {
  return { notifications }
}

function mapDispatchToProps (dispatch) {
  return {
    onDismiss: (message) => dispatch(dismiss(message)),
    onView: (song) => dispatch(selectSong(song))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
