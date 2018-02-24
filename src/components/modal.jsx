import React from 'react'

import Overlay from './overlay'

const Modal = ({ open, className, title, buttonLabel, onSubmit, onCancel, children }) => (
  <Overlay open={open} className={className}>
    <form className='modal__panel' onSubmit={onSubmit}>
      <h2 className='modal__heading'>{title}</h2>
      {children}
      <div className='form-actions'>
        {onCancel && (
          <button className='button' type='button' onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className='button'>{buttonLabel}</button>
      </div>
    </form>
  </Overlay>
)

export default Modal
