import React from 'react'
import { connect } from 'react-redux'
import WebView from 'react-electron-webview'
import cheerio from 'cheerio'

import { LOAD_RESOURCES } from '../actions'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = {
      password: '',
      progress: '',
      started: false
    }
  }

  getResources (e) {
    e.preventDefault()

    this.setState({
      started: true,
      progress: 'Accessing LCV website...'
    })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'http://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(`
          document.querySelector('#smartPassword').value = '${this.state.password}'
          document.querySelector('#smartPWLogin').submit()
        `, true, () => this.setState({ progress: 'Logging in to resources area...' }))
        break
      case 'http://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
        this.setState({ progress: 'Retrieving LCV resource information...' })
        this.harvestData(e.target)
        break
    }
  }

  harvestData (webView) {
    webView.executeJavaScript('document.querySelector("#downloads").innerHTML', true, html => {
      let $ = cheerio.load(html)

      let resources = $('a[href$=pdf], a[href$=mp3]').map((i, el) => {
        return {
          title: $(el).closest('tr').find('td:first-child').text().trim(),
          voice: $(el).text().trim(),
          url: $(el).attr('href').trim()
        }
      }).toArray()

      this.props.loadResources(resources)

      this.setState({
        progress: `Retrieved ${resources.length} resources`
      })
    })
  }

  renderBrowser () {
    if (!this.state.started) return null

    return (
      <WebView style={{ width: 0, height: 0 }}
        onDidFinishLoad={this.handleFinishLoad.bind(this)}
        src='http://www.londoncityvoices.co.uk/choir-resources/' />
    )
  }

  render () {
    return (
      <form className='scraper' onSubmit={this.getResources.bind(this)}>
        <label className='field'>
          <span className='field__label'>LCV website password</span>
          <input type='password'
            className='field__input'
            value={this.state.password}
            required
            onChange={(e) => this.setState({ password: e.target.value })} />
        </label>
        <div className='form-actions'>
          <button className='button'>Get resources</button>
        </div>
        <span>{this.state.progress}</span>
        {this.renderBrowser()}
      </form>
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
