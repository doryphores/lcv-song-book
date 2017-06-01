import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import WebView from 'react-electron-webview'

import { loadResources, notify } from '../actions'
import Icon from './icon'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = { started: false }
  }

  componentDidMount () {
    if (this.props.password) {
      let oneDay = 1000 * 60 * 60 * 24 // in milliseconds
      if (this.props.lastUpdate < (Date.now() - oneDay)) this.start()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.password === '' && nextProps.password !== '') {
      this.start()
    }
  }

  start () {
    if (this.state.started) return
    this.props.notify('Accessing LCV website…')
    this.setState({ started: true })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'https://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(
          `document.body.textContent.includes("You've entered an invalid password")`,
          true, invalidPassword => {
            if (invalidPassword) {
              this.props.notify('Invalid LCV website password. Check your password and try again.')
              this.setState({ started: false })
            } else {
              e.target.executeJavaScript(`
                document.querySelector('#smartPassword').value = '${this.props.password}'
                document.querySelector('#smartPWLogin').submit()
              `, true, () => {
                this.props.notify('Accessing resources area…')
              })
            }
          }
        )
        break
      case 'https://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
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
        this.props.notify('All resources retrieved')
        this.props.loadResources(resources)
        this.setState({ started: false })
      }
    )
  }

  renderBrowser () {
    if (!this.state.started) return null

    return (
      <WebView style={{ width: 0, height: 0 }}
        onDidFinishLoad={this.handleFinishLoad.bind(this)}
        src='https://www.londoncityvoices.co.uk/choir-resources/' />
    )
  }

  classNames () {
    return classnames(
      this.props.className,
      'scraper',
      {
        'scraper--working': this.state.started
      }
    )
  }

  render () {
    return (
      <div className={this.classNames()}>
        <Icon icon='refresh'
          className='scraper__icon'
          onClick={this.start.bind(this)} />
        {this.renderBrowser()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    password: state.settings.password,
    lastUpdate: state.settings.lastResourceUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return {
    notify: message => dispatch(notify(message, true)),
    loadResources: resources => dispatch(loadResources(resources))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scraper)
