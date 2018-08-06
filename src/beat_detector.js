import { Howler } from 'howler'
import { analyze, guess } from 'web-audio-beat-detector'

export function detectBeats (url) {
  return new Promise((resolve) => {
    window.fetch(url).then(function (response) {
      return response.arrayBuffer()
    }).then(function (buffer) {
      Howler.ctx.decodeAudioData(buffer, function (decodedData) {
        Promise.all([
          analyze(decodedData),
          guess(decodedData)
        ]).then(results => resolve({
          bpm: results[0],
          offset: results[1].offset
        }))
      })
    })
  })
}
