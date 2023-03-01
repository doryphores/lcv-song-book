import React, { useCallback, useEffect, useRef } from 'react'

import KeyCapture from '../key_capture'
import Overlay from './overlay'

type ModalProps = {
  open: boolean
  className?: string
  buttonLabel: string
  title: string
  onSubmit: () => void
  onCancel: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  open,
  className,
  buttonLabel,
  title,
  onSubmit,
  onCancel,
  children,
}) => {
  const keyCapture = useRef<KeyCapture>(null)

  useEffect(() => {
    keyCapture.current = new KeyCapture({
      'Escape': onCancel,
    })

    return () => keyCapture.current.deactivate()
  }, [])

  useEffect(() => {
    if (open) keyCapture.current.activate()
    else keyCapture.current.deactivate()
  }, [open])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }, [onSubmit])

  return (
    <Overlay open={open} className={className}>
      <form className='modal__panel' onSubmit={handleSubmit}>
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
}

export default Modal
