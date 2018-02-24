import React from 'react'

import KeyCapture from '../key_capture'
import Overlay from './overlay'

export default class Modal extends React.Component {
  constructor (props) {
    super(props)

    this.keyCapture = new KeyCapture({
      'escape': props.onCancel
    })
  }

  componentWillUnmount () {
    this.keyCapture.deactivate()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open && !this.props.open) {
      this.keyCapture.activate()
    } else if (!nextProps.open && this.props.open) {
      this.keyCapture.deactivate()
    }
  }

  render () {
    return (
      <Overlay open={this.props.open} className={this.props.className}>
        <form className='modal__panel' onSubmit={this.props.onSubmit}>
          <h2 className='modal__heading'>{this.props.title}</h2>
          {this.props.children}
          <div className='form-actions'>
            {this.props.onCancel && (
              <button className='button' type='button' onClick={this.props.onCancel}>
                Cancel
              </button>
            )}
            <button className='button'>{this.props.buttonLabel}</button>
          </div>
        </form>
      </Overlay>
    )
  }
}
