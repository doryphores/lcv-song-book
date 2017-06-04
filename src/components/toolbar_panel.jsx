import React from 'react'
import classnames from 'classnames'

import Icon from './icon'

const ToolbarPanel = ({ className, toggleIcon, spinToggle = false, onToggle, children }) => (
  <div className={className}>
    {children}

    <button className={buttonClassnames(spinToggle)} onClick={onToggle}>
      <Icon icon={toggleIcon} className='toolbar__button-icon' />
    </button>
  </div>
)

function buttonClassnames (spin) {
  return classnames('toolbar__button', {
    'toolbar__button--spinning': spin
  })
}

export default ToolbarPanel
