import React from 'react'
import classnames from 'classnames'

const ICONS = {
  'arrow_drop_down': 'navigation',
  'audiotrack': 'image',
  'check': 'navigation',
  'close': 'navigation',
  'cloud_download': 'file',
  'error': 'alert',
  'help': 'action',
  'help_outline': 'action',
  'info': 'action',
  'info_outline': 'action',
  'pause_circle_filled': 'av',
  'play_circle_filled': 'av',
  'refresh': 'navigation',
  'search': 'action',
  'settings': 'action',
  'voicemail': 'communication'
}

const Icon = ({ className, icon, style = {}, onClick }) => (
  <svg className={classnames(className, 'icon')} style={style} onClick={onClick}>
    <use xlinkHref={`../static/sprites/svg-sprite-${ICONS[icon]}.svg#ic_${icon}_24px`} />
  </svg>
)

export default Icon
