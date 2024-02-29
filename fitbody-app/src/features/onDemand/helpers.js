import * as _ from 'lodash'
import moment from 'moment'

export const filterForSectionList = (array, categories, searchString) => {
  const filtered = _.groupBy(
    array.filter((video) => video.name.toLowerCase().includes(searchString.toLowerCase())),
    (item) => item.category_id,
  )
  let results = []
  for (let k in filtered) {
    results.push({ title: (categories.find((c) => c.id === Number(k)) || {}).name, data: filtered[k] })
  }
  return results
}

export const formatVideoDuration = (seconds) => {
  // time comes from a video object, it'll be in 'hh:mm:ss' format
  if (typeof seconds === 'string') {
    let parts = seconds.split(':')
    if (parts[0] === '00') {
      parts.shift()
      return moment(parts.join(':'), ['mm:ss']).format('mm:ss')
    }
    return moment(parts.join(':'), ['hh:mm:ss']).format('H:mm:ss')
  }
  // time comes from the video player controls as Int of seconds
  const [begin, end] = seconds >= 3600 ? [11, 8] : [14, 5]
  const date = new Date(0)

  date.setSeconds(seconds)
  return date.toISOString().substr(begin, end)
}

export const createCompletion = (video, durationWatched = 0, manual = false, manualDate) => {
  const date = manualDate ? manualDate : moment().format('YYYY-MM-DD')
  const completion = {
    server: {
      video_id: video.id,
      date,
      time: durationWatched,
      manual,
      meta: {},
    },
    local: {
      video_id: video.id,
      date,
      time: durationWatched,
      meta: {},
      hidden: false,
      manual,
      category_icon_url: null,
      title: video.title,
      category_id: video.category_id,
      trainer_id: video.trainer_id,
      is_video: true,
    },
  }

  return completion
}

export const VIDEO_CATEGORIES = Object.freeze({
  // these match the names in redux
  ON_DEMAND: 'On Demand',
  GUIDANCE: 'Guidance',
})
