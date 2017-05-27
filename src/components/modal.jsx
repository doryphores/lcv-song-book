import React from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import FirstChild from './first_child'

const Modal = ({ open, title, buttonLabel, onSubmit, onCancel, children }) => (
  <CSSTransitionGroup component={FirstChild}
    transitionName='slide-down'
    transitionEnterTimeout={400}
    transitionLeaveTimeout={400}>
    {open && (<div className='modal u-flex u-flex--vertical u-flex--center'>
      <form className='modal__panel' onSubmit={onSubmit}>
        <h2 className='modal__heading'>{title}</h2>
        {children}
        <div className='form-actions'>
          <button className='button'>{buttonLabel}</button>
          {onCancel && (
            <button className='button' type='button' onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>)}
  </CSSTransitionGroup>
)

export default Modal
