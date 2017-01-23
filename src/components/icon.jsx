import React from 'react'
import classnames from 'classnames'

const ICONS = {
  'settings': 'action',
  'play_circle_filled': 'av',
  'pause_circle_filled': 'av',
  'arrow_drop_down': 'navigation',
  'refresh': 'navigation',
  'close': 'navigation',
  'check': 'navigation'
}

const Icon = ({ className, icon, onClick }) => (
  <svg className={classnames(className, 'icon')} onClick={onClick}>
    <use xlinkHref={`./sprites/svg-sprite-${ICONS[icon]}.svg#ic_${icon}_24px`} />
  </svg>
)

export default Icon
