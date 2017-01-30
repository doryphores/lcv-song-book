import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import WebView from 'react-electron-webview'

import { LOAD_RESOURCES } from '../actions'
import Icon from './icon'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      started: false,
      done: false,
      password: '',
      progress: ''
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.open && this.state.open) {
      this.refs.password.focus()
    }
  }

  toggle () {
    this.setState({ open: !this.state.open })
  }

  getResources (e) {
    e.preventDefault()

    this.setState({
      started: true,
      progress: 'Accessing LCV website…'
    })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'http://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(`
          document.querySelector('#smartPassword').value = '${this.state.password}'
          document.querySelector('#smartPWLogin').submit()
        `, true, () => this.setState({ progress: 'Accessing resources area…' }))
        break
      case 'http://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
        this.harvestData(e.target)
        break
    }
  }

  harvestData (webView) {
    webView.executeJavaScript(
      `Array.prototype.slice.call(
        document.querySelectorAll('#downloads a[href$=pdf], #downloads a[href$=mp3]'),
        0
      ).map(el => {
        return {
          title: el.closest('tr').querySelector('td:first-child').innerHTML.trim(),
          voice: el.innerHTML.trim(),
          url: el.href
        }
      })`,
      true,
      resources => {
        this.props.loadResources(resources)

        this.setState({
          progress: `All resources retrieved`,
          done: true
        })

        setTimeout(() => this.setState({ open: false }), 2000)
        setTimeout(() => this.setState({ done: false }), 3000)
      }
    )
  }

  renderBrowser () {
    if (!this.state.started) return null

    return (
      <WebView style={{ width: 0, height: 0 }}
        onDidFinishLoad={this.handleFinishLoad.bind(this)}
        src='http://www.londoncityvoices.co.uk/choir-resources/' />
    )
  }

  renderContents () {
    if (this.state.started) {
      return (
        <div className='scraper__progress'>
          <Icon className='scraper__progress-icon'
            icon={this.state.done ? 'check' : 'refresh'} />
          <span>{this.state.progress}</span>
        </div>
      )
    } else {
      return (
        <form onSubmit={this.getResources.bind(this)}>
          <label className='field'>
            <input ref='password'
              type='password'
              className='field__input'
              value={this.state.password}
              required
              onChange={(e) => this.setState({ password: e.target.value })} />
            <span className='field__label'>LCV website password</span>
          </label>
          <div className='form-actions'>
            <button className='button'>Get resources</button>
          </div>
        </form>
      )
    }
  }

  classNames () {
    return classnames(
      this.props.className,
      'scraper',
      {
        'scraper--open': this.state.open,
        'scraper--done': this.state.done
      }
    )
  }

  render () {
    return (
      <div className={this.classNames()}>
        <Icon icon={this.state.open ? 'close' : 'settings'}
          className='scraper__toggle'
          onClick={this.toggle.bind(this)} />

        <div className='scraper__overlay u-flex u-flex--vertical u-flex--center'>
          <div className='scraper__panel'>
            {this.renderContents()}
            {this.renderBrowser()}
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadResources: resources => dispatch({
      type: LOAD_RESOURCES,
      payload: resources
    })
  }
}

export default connect(undefined, mapDispatchToProps)(Scraper)
