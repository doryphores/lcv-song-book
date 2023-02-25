import React, { useCallback } from 'react'
import classnames from 'classnames'

type ResizerProps  = {
  className: string
  onResize: (x: number) => void
}

const Resizer: React.FC<ResizerProps> = ({
  className,
  onResize
}) => {
  const handleResize = useCallback((e: MouseEvent) => {
    onResize(e.clientX)
    window.dispatchEvent(new UIEvent('resize'))
  }, [])

  const stopResize = useCallback(() => {
    document.body.classList.remove('u-resizing')
    window.removeEventListener('mouseup', stopResize)
    window.removeEventListener('mousemove', handleResize)
  }, [])

  const startResize = useCallback(() => {
    document.body.classList.add('u-resizing')
    window.addEventListener('mouseup', stopResize)
    window.addEventListener('mousemove', handleResize)
  }, [])

  return (
    <div
      className={classnames(className, 'resizer')}
      onMouseDown={startResize}
    />
  )
}

export default Resizer
