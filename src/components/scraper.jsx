import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import WebView from 'react-electron-webview'
import CSSTransistionGroup from 'react-transition-group/CSSTransitionGroup'

import { loadResources } from '../actions'
import Icon from './icon'
import FirstChild from './first_child'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = {
      started: false,
      done: false,
      progress: ''
    }
  }

  componentDidMount () {
    let oneDay = 1000 * 60 * 60 * 24 // in milliseconds
    if (this.props.lastUpdate < (Date.now() - oneDay)) this.start()
  }

  start () {
    this.setState({
      started: true,
      progress: 'Accessing LCV website…'
    })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'http://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(`
          document.querySelector('#smartPassword').value = '${this.props.password}'
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
          done: true,
          started: false
        })

        setTimeout(() => this.setState({
          done: false,
          progress: ''
        }), 2000)
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

  classNames () {
    return classnames(
      this.props.className,
      'scraper',
      {
        'scraper--working': this.state.started && !this.state.done,
        'scraper--done': this.state.done
      }
    )
  }

  render () {
    return (
      <div className={this.classNames()}>
        <CSSTransistionGroup component={FirstChild}
          transitionName='fade-right'
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}>
          {this.state.progress ? (
            <span className='scraper__message'>{this.state.progress}</span>
          ) : null}
        </CSSTransistionGroup>
        <Icon icon={this.state.done ? 'check' : 'refresh'}
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
    loadResources: resources => dispatch(loadResources(resources))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scraper)
