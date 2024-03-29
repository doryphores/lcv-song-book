import { BrowserView, BrowserWindow, session, WebRequestFilter } from 'electron'
import { mapKeys, sortBy } from 'lodash'

export async function getSongs (appWindow: BrowserWindow, credentials: Credentials) {
  const scraper = new Scraper(appWindow)
  return await scraper.run(credentials)
}

const SONGS_URL = 'https://www.londoncityvoices.co.uk/choirmembership/all-songs'

class Scraper {
  appWindow: BrowserWindow
  view: BrowserView
  songs: Song[] = []
  termSongs: string[]

  constructor (appWindow: BrowserWindow) {
    this.appWindow = appWindow
    this.view = new BrowserView({
      webPreferences: { partition: this.setupSession() },
    })

    this.appWindow.setBrowserView(this.view)
    this.view.setBounds({ x: -1000, y: 2000, width: 1000, height: 800 })
    // this.view.webContents.openDevTools()
  }

  setupSession () {
    const partition = 'scraper'
    const ses = session.fromPartition(partition)

    const filter: WebRequestFilter = {
      urls: [
        'mp3',
        'png',
        'jpeg',
        'jpg',
        'css',
        'svg',
        'woff',
        'otf',
        'woff2',
      ].map(ext => `https://*/*.${ext}`).concat(['https://www.googletagmanager.com/*']),
    }

    // block all unnecessary asset requests to optimize scraping process
    ses.webRequest.onBeforeRequest(filter, (_request, callback) => {
      callback({ cancel: true })
    })

    return partition
  }

  async run (credentials: Credentials) {
    try {
      await this.loadURL(SONGS_URL)
      let onSongListingPage = await this.waitForElement('h1.songtitle', 1000)
      if (!onSongListingPage) {
        await this.login(credentials)
        onSongListingPage = await this.waitForElement('h1.songtitle')
        if (!onSongListingPage) throw new Error('Failed to collect songs from LCV website. Please try again.')
      }
      console.log('on song page')
      this.termSongs = await this.collectTermSongTitles()
      await this.collectSongs()
      if (this.songs.length === 0) {
        throw new Error('Failed to collect songs from LCV website. Please try again.')
      }
      return this.songs
    } finally {
      this.appWindow.removeBrowserView(this.view)
    }
  }

  private async login (credentials: Credentials) {
    try {
      await this.waitForElement('input[name=username]', 1000)
      await this.fill('username', credentials.username)
      await this.fill('password', credentials.password)
      console.log('submitted login')
      await this.submitForm()
    } catch(err) {
      throw new Error('Login failed, check your username and password')
    }
  }

  private async collectSongs (): Promise<void> {
    const pageSongs = await this.collectSongsFromPage()
    this.songs = sortBy(this.songs.concat(pageSongs), 'title')

    const nextPageURL = await this.runScript(`document.querySelector('[aria-label="Next Page"]')?.href`)
    if (nextPageURL) {
      await this.loadURL(nextPageURL)
      return await this.collectSongs()
    }

    this.broadcastProgress({
      total: this.songs.length,
      collected: 0,
    })

    let collected = 0

    for (const song of this.songs) {
      console.log(song.title)
      const { sheets, recordings } = await this.collectSongDetails(song.url)

      song.thisTerm = this.isTermSong(song)
      song.sheets = mapKeys(sheets, (_v, k) => k.toLowerCase())
      song.recordings = mapKeys(recordings, (_v, k) => k.toLowerCase())

      this.broadcastProgress({
        total: this.songs.length,
        collected: collected += 1,
      })
    }
  }

  private isTermSong (song: Song): boolean {
    return this.termSongs.includes(song.title)
  }

  private collectTermSongTitles (): Promise<string[]> {
    return this.runScript(`
      Array.from(document.querySelectorAll('[data-w-tab="This term\\'s songs"] h1.songtitle')).map(el => {
        return el.innerText
      })
    `, false)
  }

  private collectSongsFromPage (): Promise<Song[]> {
    return this.runScript(`
      Array.from(document.querySelectorAll('[data-w-tab="All Songs"] h1.songtitle')).map(el => {
        return {
          title: el.innerText,
          url: el.parentElement.parentElement.href
        }
      }).filter(s => s.url)
    `, false)
  }

  private async collectSongDetails (url: string): Promise<Song> {
    await this.loadURL(url)
    return this.runScript(`
      (function () {
        const sheets = Array.from(document.querySelectorAll('.pdf-button')).reduce((r, button) => {
          return {
            ...r,
            [button.textContent]: button.href
          }
        }, {})
        const recordings = Array.from(document.querySelectorAll('[data-plyr=download]')).reduce((r, el) => {
          return {
            ...r,
            [el.parentElement.parentElement.parentElement.previousSibling.textContent]: el.href
          }
        }, {})
        return { sheets, recordings }
      })()
    `, false)
  }

  private loadURL (url: string): Promise<void> {
    this.view.webContents.loadURL(url)
    return new Promise(resolve => {
      this.view.webContents.once('did-finish-load', () => {
        resolve()
      })
    })
  }

  private runScript (script: string, userGesture = true) {
    return this.view.webContents.executeJavaScript(
      script,
      userGesture,
    )
  }

  private fill (inputName: string, value: string) {
    return this.runScript(`
      const ${inputName} = document.querySelector('input[name=${inputName}]')
      ${inputName}.dispatchEvent(new Event('focus', { bubbles: true }))
      ${inputName}.value = '${value}'
      ${inputName}.dispatchEvent(new Event('input', { bubbles: true }))
    `)
  }

  private submitForm (): Promise<void> {
    this.runScript(`
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      document.querySelector('button').dispatchEvent(clickEvent)
    `)
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(), 5000)
      this.view.webContents.once('did-finish-load', () => {
        clearTimeout(timer)
        resolve()
      })
    })
  }

  private waitForElement (selector: string, timeout = 5000) {
    return this.waitFor(`document.querySelector('${selector}')`, timeout)
  }

  private waitForContent (content: string) {
    return this.waitFor(`document.body.textContent.includes('${content}')`)
  }

  private waitFor (condition: string, timeout = 5000) {
    return this.runScript(`
      (async function () {
        function delay (timeout, cb) {
          return new Promise (resolve => {
            setTimeout(() => resolve(cb()), timeout)
          })
        }
        let timedOut = false
        delay(${timeout}, () => timedOut = true)
        async function waitForCondition () {
          if (timedOut) return false
          if (${condition}) return true
          return await delay(100, waitForCondition)
        }
        return await waitForCondition()
      })()
    `)
  }

  private broadcastProgress (progress: ScraperProgress) {
    this.appWindow.webContents.send('scraper-progress', progress)
  }
}
