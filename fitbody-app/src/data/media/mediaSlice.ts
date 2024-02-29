import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import RNFS from 'react-native-fs'
import { unzip } from 'react-native-zip-archive'
import RNBackgroundDownloader from 'react-native-background-downloader'
import _ from 'lodash'

import { generateDownloadEntry } from '../workout/workoutsSlice'

import { storeRegistry } from '../../store/storeRegistry'
import api from '../../services/api'

import mediaData from '../../../assets/media.json'

import {
  FETCH_MEDIA,
  IMediaVideo,
  IVideoCategory,
  VideoCategories,
  IVideo,
  IDownloadData,
  MediaGrouped,
  IDownloadLinks,
  IDownloadState,
  GuidanceState,
  OnDemandState,
  CategoryState,
} from './types'
import { DownloadEntryType } from '../workout/types'

const objectifyArray = <T>(array: T[]): T => {
  return array.reduce((acc: T, next: any) => {
    const key = Object.keys(next)[0] as keyof T
    return {
      ...acc,
      [key]: next[key],
    }
  }, {} as T)
}

export const fetchMedia = createAsyncThunk(FETCH_MEDIA, async (payload, thunkAPI) => {
  try {
    const videos = await api.guidance.getAllv4()

    const categories = videos.types.reduce((acc, t) => {
      return {
        ...acc,
        [t.name]: t.categories,
      }
    }, {}) as CategoryState

    // parse array of all videos into groups
    const media = videos.types.reduce((acc, t) => {
      return {
        ...acc,
        [t.name]: t.categories.map((c: IVideoCategory) => ({
          [c.name]: videos.videos.filter((v) => c.id === v.category_id),
        })),
      }
    }, {}) as IMediaVideo

    const guidance = media.Guidance
    const onDemand = media['On Demand']

    // set 'pre-download' data into state
    thunkAPI.dispatch(
      mediaSlice.actions.fetchMediaStarted({ guidance: objectifyArray(guidance), onDemand: objectifyArray(onDemand), categories }),
    )

    const links: IDownloadLinks[] = []

    const resolveMediaTypeLinks = async (mt: MediaGrouped) => {
      const name = Object.keys(mt)[0] as VideoCategories
      const values = Object.values(mt)[0] as IVideo[]
      mt[name] = await Promise.all(
        values.map(async (k) => {
          const link1 = (await generateDownloadEntry(DownloadEntryType.media, k.id, k.thumbnail)) as IDownloadLinks

          links.push(link1)

          return {
            ...k,
            thumbnail: `/${link1.ZipPath}`,
          }
        }),
      )
      return mt
    }

    const resolveMediaType = (list: MediaGrouped[]): Promise<MediaGrouped[]> => {
      return Promise.all(
        list.map((g) => {
          return resolveMediaTypeLinks(g)
        }),
      )
    }

    const resolveGuidanceCategoryLinks = async (c: IVideoCategory) => {
      const link2 = (await generateDownloadEntry(DownloadEntryType.media, c.id, c.icon_url)) as IDownloadLinks
      const link3 = (await generateDownloadEntry(DownloadEntryType.media, c.id, c.image_url)) as IDownloadLinks
      const link4 = (await generateDownloadEntry(DownloadEntryType.media, c.id, c.header_image_url)) as IDownloadLinks

      links.push(link2)
      links.push(link3)
      links.push(link4)

      return {
        ...c,
        icon_url: `/${link2.ZipPath}`,
        image_url: `/${link3.ZipPath}`,
        header_image_url: `/${link4.ZipPath}`,
      }
    }

    const resolveOnDemandCategoryLinks = async (c: IVideoCategory) => {
      const link3 = (await generateDownloadEntry(DownloadEntryType.media, c.id, c.image_url)) as IDownloadLinks
      const link4 = (await generateDownloadEntry(DownloadEntryType.media, c.id, c.header_image_url)) as IDownloadLinks

      links.push(link3)
      links.push(link4)

      return {
        ...c,
        image_url: `/${link3.ZipPath}`,
        header_image_url: `/${link4.ZipPath}`,
      }
    }

    const resolveCategories = async (): Promise<CategoryState[]> => {
      return Promise.all(
        videos.types.map(async (type) => {
          return {
            [type.name]: await Promise.all(
              type.categories.map(async (c) => {
                if (type.name === 'Guidance') {
                  return resolveGuidanceCategoryLinks(c)
                } else if (type.name === 'On Demand') {
                  return resolveOnDemandCategoryLinks(c)
                }
              }),
            ),
          } as unknown as CategoryState
        }),
      )
    }

    const finalObject = {
      categories: objectifyArray(await resolveCategories()),
      guidance: objectifyArray(await resolveMediaType(guidance)) as MediaGrouped,
      onDemand: objectifyArray(await resolveMediaType(onDemand)) as MediaGrouped,
    } as IDownloadData

    // console.log('Copy to /assets/media.json', JSON.stringify(finalObject))
    // console.log('FINAL', finalObject)

    download(links, finalObject, DownloadEntryType.media)
    return finalObject
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const download = async (
  links: IDownloadLinks[],
  finalObject: IDownloadData,
  type: 'media',
  register = true,
  existingId = null,
  additionalFields = {},
) => {
  const downloadId = existingId ?? uuidv4()

  const filteredLinks = _.uniqBy(
    links.filter((x) => !(x === null || x.skipDownload)),
    'ZipPath',
  )
  const resp2 = await api.downloads.requestDownload({ entries: filteredLinks })

  if (register) {
    storeRegistry.dispatch(
      mediaSlice.actions.registerDownloads({
        downloadId,
        progress: 10,
        payloadToSave: finalObject,
        links: filteredLinks,
        type,
        ...additionalFields,
      }),
    )
  }

  // console.log(filteredLinks.length)
  // console.log('---type', type)
  // console.log('---url', resp2.url)

  if (filteredLinks.length > 0) {
    RNBackgroundDownloader.download({
      id: downloadId,
      url: resp2.url,
      destination: `${RNFS.DocumentDirectoryPath}/${downloadId}.zip`,
      headers: {
        Authorization: 'Bearer ' + storeRegistry.getState().services.session.apiToken,
      },
    })
      .begin(() => {
        // console.log(`Going to download ${expectedBytes} bytes!`)
      })
      .progress((percent) => {
        // console.log(`Downloaded: ${percent * 100}%`)
        storeRegistry.dispatch(mediaSlice.actions.updateProgress({ downloadId, progress: 10 + percent * 90 }))
      })
      .done(async () => {
        // console.log('Download is done!')
        try {
          await unzip(`${RNFS.DocumentDirectoryPath}/${downloadId}.zip`, RNFS.DocumentDirectoryPath)
          storeRegistry.dispatch(mediaSlice.actions.downloadComplete(downloadId))
        } catch (error) {
          console.warn('Unzip error: ', error, '\nfor url: ', resp2.url, '\nfilteredLinks: ', filteredLinks)
        }
      })
      .error((error) => {
        console.log('Download canceled due to error: ', error)
      })
  } else {
    storeRegistry.dispatch(mediaSlice.actions.downloadComplete(downloadId))
  }
}

export const initialState: {
  guidance: GuidanceState
  categories: CategoryState
  onDemand: OnDemandState
  downloads: { [key: string]: IDownloadState }
} = {
  ...mediaData,
  downloads: {},
}

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    fetchMediaStarted: (state, action: PayloadAction<IDownloadData>) => {
      state.guidance = action.payload.guidance
      state.categories = action.payload.categories
      state.onDemand = action.payload.onDemand
    },
    registerDownloads: (state, action: PayloadAction<IDownloadState>) => {
      if (state.downloads === null || state.downloads === undefined) {
        state.downloads = {}
      }
      state.downloads[action.payload.downloadId] = action.payload
    },
    updateProgress: (state, action: PayloadAction<{ downloadId: string; progress: number }>) => {
      if (state.downloads[action.payload.downloadId]) {
        state.downloads[action.payload.downloadId].progress = action.payload.progress
      }
    },
    downloadComplete: (state, action: PayloadAction<string>) => {
      // console.log('media downloadComplete', action.payload)
      const dl = state.downloads[action.payload]
      switch (dl.type) {
        case DownloadEntryType.media:
          state.guidance = { ...state.guidance, ...dl.payloadToSave!.guidance }
          state.categories = { ...state.categories, ...dl.payloadToSave.categories }
          state.onDemand = { ...state.onDemand, ...dl.payloadToSave.onDemand }
          break
        default:
          break
      }

      delete state.downloads[action.payload]
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMedia.fulfilled, () => {
      // console.log('FULFILLED', action.payload)
    })
  },
})

export const { fetchMediaStarted } = mediaSlice.actions

export default mediaSlice.reducer
