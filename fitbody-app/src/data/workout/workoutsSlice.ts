import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import RNFS from 'react-native-fs'
import { unzip } from 'react-native-zip-archive'
import { v4 as uuidv4 } from 'uuid'
import RNBackgroundDownloader from 'react-native-background-downloader'

import _ from 'lodash'

import trainerData from '../../../assets/trainers.json'
import api from '../../services/api'
import { transactionHub } from '../../services/helpers'
import { storeRegistry } from '../../store/storeRegistry'
import {
  DownloadEntry,
  DownloadEntryType,
  FinalObject,
  IProgram,
  ITrainer,
  IWorkout,
  IExercise,
  ICardioExercise,
  ProgramTypes,
  WorkoutState,
  IClearCheckmarksPayload,
  ICreateCompletionPayload,
  IHideCompletionPayload,
  IGetWeekPayload,
  TrainersJson,
  ActionWithPayload,
  ICompletion,
  FETCH_TRAINERS_PROGRAMS,
  FETCH_CHALLENGES,
  FETCH_WEEK,
  FETCH_COMPLETIONS,
  CLEAR_CHECKMARKS,
  CREATE_COMPLETION,
  HIDE_COMPLETION,
  GET_WEEK,
  GET_QUIZ_QUESTIONS,
  SUBMIT_COMPLETION_COMMIT,
  SUBMIT_COMPLETION_ROLLBACK,
  IProgress,
  ISubmitCompletionPayload,
  IClearDownloadsPayload,
  ISetAlternativeExercisesMapPayload,
  IDownloadStateData,
  IChallengeMonth,
  IWorkoutWithCircuits,
  ICircuit,
  ICardioWorkoutWithWalkthroughs,
  IFetchTrainersProgramsPayload,
} from './types'

export const initialState: WorkoutState = {
  week: null,
  weeks: {},
  workout: null,
  challenge: null,
  circuitIndex: 0,
  roundIndex: 0,
  excerciseIndex: 0,
  times: [],
  isRecoverable: false,
  downloading: [],
  downloadInfoViewed: false,
  initialWeeksDownloaded: false,
  downloadingChallenges: [],
  downloadedWorkouts: {},
  downloadedChallenges: {},
  downloadedVideos: {},
  downloadedChallengeVideos: {},
  currentTrainer: null,
  currentProgram: null,
  completions: [],
  alternativeExercisesMap: {},
  categories: {},
  quizQuestions: null,
  trainersExtracted: false,
  workouts: {},
  circuits: {},
  exercises: {},
  cardio_types: {},
  levels: {},
  cardio_walkthroughs: {},
  cardio_exercises: {},
  circuit_masters: {},
  challengeMonth: undefined,
  downloads: {},
  currentCategory: 0,
  currentWorkout: undefined,
  progress: null,
  ...(trainerData as TrainersJson),
}

export const generateDownloadEntry = async (
  type: DownloadEntryType,
  id: number | null | undefined,
  field: string | null,
  forceDownload?: boolean,
  // path?: string,
): Promise<DownloadEntry | void> => {
  // console.log('---' + type, field)
  // console.log('generateDownloadEntry called')
  if (field === null || field === undefined) {
    return
  }

  const pathToSave = `assets/${type}${id ? `/${id}` : ''}/${field.substring(field.lastIndexOf('/') + 1)}`
  const localPath = `${RNFS.DocumentDirectoryPath}/${pathToSave}`

  await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/assets/${type}${id ? `/${id}` : ''}`)

  // console.log('[900] checking if exists: ', localPath)
  const exists = await RNFS.exists(localPath)
  if (!exists || forceDownload) {
    // console.log('file does not exist')
    return { Url: field, ZipPath: pathToSave }
  } else {
    // console.log('[900] exists')
    return { Url: field, ZipPath: pathToSave, skipDownload: true }
  }
}

export const fetchTrainersPrograms = createAsyncThunk(
  FETCH_TRAINERS_PROGRAMS,
  async (_payload: IFetchTrainersProgramsPayload | undefined, thunkAPI) => {
    const forceDownload = _payload?.forceDownload ? true : false
    const response = await api.workouts.getTrainers()
    const data = response.data
    const programs = data.reduce(
      (res, cur) => ({ ...res, ...cur.programs.reduce((r, c) => ({ ...r, [c.slug]: c }), {}) }),
      {} as Record<ProgramTypes, IProgram>,
    )
    const trainers = data.map((t) => ({ ...t, programs: t.programs.map((p) => p.id) }))
    // console.log('programs', programs)
    thunkAPI.dispatch(workoutsSlice.actions.fetchTrainersProgramsStarted({ programs, trainers }))

    const links: (DownloadEntry | void)[] = []

    const finalObject: FinalObject = {
      trainers: await Promise.all(
        trainers.map(async (t: ITrainer): Promise<ITrainer> => {
          const link1 = await generateDownloadEntry(DownloadEntryType.trainers, t.id, t.logo_url, forceDownload)
          const link2 = await generateDownloadEntry(DownloadEntryType.trainers, t.id, t.foreground_img_url, forceDownload)
          const link3 = await generateDownloadEntry(DownloadEntryType.trainers, t.id, t.background_img_url, forceDownload)
          const link4 = await generateDownloadEntry(DownloadEntryType.trainers, t.id, t.banner_img_url, forceDownload)

          links.push(link1, link2, link3, link4)

          return {
            ...t,
            logo_url: `/${link1?.ZipPath}`,
            foreground_img_url: `/${link2?.ZipPath}`,
            background_img_url: `/${link3?.ZipPath}`,
            banner_img_url: `/${link4?.ZipPath}`,
          }
        }),
      ),
      programs: await data.reduce(async (res, cur) => {
        const trainerProggies = await cur.programs.reduce(async (r, c) => {
          const link5 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.background_image_url, forceDownload)
          const link11 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.background_image_color_card_url, forceDownload)
          const link6 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.icon_url, forceDownload)
          const link7 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.logo_big_url, forceDownload)
          const link8 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.logo_small_url, forceDownload)
          const link10 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, c.video_url, forceDownload)

          links.push(link5, link6, link7, link8, link11, link10)

          const program = {
            ...c,
            background_image_url: `/${link5?.ZipPath}`,
            background_image_color_card_url: `/${link11?.ZipPath}`,
            icon_url: `/${link6?.ZipPath}`,
            logo_big_url: `/${link7?.ZipPath}`,
            logo_small_url: `/${link8?.ZipPath}`,
            video_url: `/${link10?.ZipPath}`,
            categories: await Promise.all(
              c.categories.map(async (cat) => {
                const link9 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, cat.image, forceDownload)
                const link12 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, cat.icon_url, forceDownload)
                links.push(link9)

                return {
                  ...cat,
                  image: `/${link9?.ZipPath}`,
                  icon_url: `/${link12?.ZipPath}`,
                }
              }),
            ),
            equipment: await Promise.all(
              c.equipment.map(async (eq) => {
                const link12 = await generateDownloadEntry(DownloadEntryType.trainers, cur.id, eq.icon_url, forceDownload)
                links.push(link12)

                return {
                  ...eq,
                  icon_url: `/${link12?.ZipPath}`,
                }
              }),
            ),
          } as IProgram

          return r.then(async (x) => ({
            ...x,
            [c.slug]: program,
          }))
        }, Promise.resolve({} as IProgram))

        return res.then(async (xx) => ({
          ...xx,
          ...trainerProggies,
        }))
      }, Promise.resolve({} as Record<ProgramTypes, IProgram>)),
    }

    // console.log(JSON.stringify(finalObject))

    download(links, finalObject, DownloadEntryType.trainers)
  },
)

export const download = async (
  links: (DownloadEntry | void)[],
  finalObject: { [key: string]: any },
  type: DownloadEntryType,
  register = true,
  existingId: string | null = null,
  additionalFields: { [key: string]: any } = {},
) => {
  const downloadId = existingId ?? uuidv4()

  // sentry tracking method
  transactionHub.startTransaction({
    op: 'workouts.download',
    name: 'Downloading Workouts',
    tags: {
      downloadId,
    },
    trimEnd: true,
  })

  const filteredLinks = _.uniqBy(
    links.filter((x) => !(x === null || x?.skipDownload)),
    'ZipPath',
  ) as DownloadEntry[]

  const resp2 = await api.downloads.requestDownload({ entries: filteredLinks })
  // console.log('resp', resp2)

  // const resp = await fetch('https://zipstream.herokuapp.com/create_download_link', {
  //   method: 'POST',
  //   body: JSON.stringify({ entries: links }),
  // })
  // const json = await resp2.json()

  // console.log('provided links', links.length)
  // console.log('empty links', links.filter((x) => x === null || x.skipDownload).length)

  if (register) {
    storeRegistry.dispatch(
      workoutsSlice.actions.registerDownloads({
        downloadId,
        progress: 10,
        payloadToSave: finalObject,
        links: filteredLinks,
        type,
        ...additionalFields,
      }),
    )
  }

  // console.log('---path', `${RNFS.DocumentDirectoryPath}/${downloadId}.zip`)
  // console.log('---count', filteredLinks.length)
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
        storeRegistry.dispatch(workoutsSlice.actions.updateProgress({ downloadId, progress: 10 + percent * 90 }))
      })
      .done(async () => {
        // console.log('Download is done!')
        try {
          await unzip(`${RNFS.DocumentDirectoryPath}/${downloadId}.zip`, RNFS.DocumentDirectoryPath)
          storeRegistry.dispatch(workoutsSlice.actions.downloadComplete(downloadId))
        } catch (error) {
          console.warn('Unzip error: ', error, '\nfor url: ', resp2.url, '\nfilteredLinks: ', filteredLinks)
        }
      })
      .error((error) => {
        console.log('Download canceled due to error: ', error)
      })
  } else {
    storeRegistry.dispatch(workoutsSlice.actions.downloadComplete(downloadId))
  }
}

export const fetchChallenges = createAsyncThunk(FETCH_CHALLENGES, async (payload: string, thunkAPI) => {
  const response = await api.challenges.getMonth(payload)
  const data = response.data

  thunkAPI.dispatch(workoutsSlice.actions.fetchChallengesStarted({ ...data, days: data.days.map((d) => ({ ...d, downloading: true })) }))

  const links: (DownloadEntry | void)[] = []

  const bgImageLink = await generateDownloadEntry(DownloadEntryType.challenges, null, data.bg_image_url)
  links.push(bgImageLink)

  const finalObject = {
    ...data,
    bg_image_url: `/${bgImageLink?.ZipPath}`,
    days: await Promise.all(
      data.days.map(async (d) => ({
        ...d,
        downloading: false,
        downloaded: true,
        equipment: await Promise.all(
          d.equipment.map(async (e) => {
            const link = await generateDownloadEntry(DownloadEntryType.challenges, null, e.icon_url)
            links.push(link)

            return {
              ...e,
              icon_url: `/${link?.ZipPath}`,
            }
          }),
        ),
      })),
    ),
    exercises: await Promise.all(
      data.exercises.map(async (ex) => {
        const link1 = await generateDownloadEntry(DownloadEntryType.challenges, null, ex?.video_url)
        const link2 = await generateDownloadEntry(DownloadEntryType.challenges, null, ex?.image_url)

        links.push(link1, link2)

        return {
          ...ex,
          video_url: `/${link1?.ZipPath}`,
          image_url: `/${link2?.ZipPath}`,
          equipment: await Promise.all(
            ex.equipment.map(async (eq) => {
              const link = await generateDownloadEntry(DownloadEntryType.challenges, null, eq.icon_url)
              links.push(link)

              return {
                ...eq,
                icon_url: await generateDownloadEntry(DownloadEntryType.challenges, null, eq.icon_url),
              }
            }),
          ),
        }
      }),
    ),
  }

  download(links, finalObject, DownloadEntryType.challenges)
})

export const fetchWeek = createAsyncThunk(FETCH_WEEK, async (payload: { program: number; week_number: number }, thunkAPI) => {
  const response = await api.workouts.getWorkoutWeek({ program: payload.program, week: payload.week_number }, false)
  const data = response.data

  const categories = {
    [payload.program]: { [payload.week_number]: data.categories.reduce((total, curr) => ({ ...total, [curr.id]: curr.workouts }), {}) },
  }

  let workouts = data.workouts.reduce((total, curr) => ({ ...total, [curr.id]: { ...curr, downloading: true } }), {})

  const circuits = data.circuits.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})

  const exercises = data.exercises.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})

  const cardio_types = data.cardio_types.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})
  const levels = data.levels.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})
  const cardio_walkthroughs = data.cardio_walkthroughs.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})

  const cardio_exercises = data.cardio_exercises.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})
  const circuit_masters = data.circuit_masters.reduce((total, curr) => ({ ...total, [curr.id]: curr }), {})

  thunkAPI.dispatch(
    workoutsSlice.actions.fetchWeekStarted({
      ...payload,
      categories,
      workouts,
      circuits,
      exercises,
      cardio_types,
      levels,
      cardio_walkthroughs,
      cardio_exercises,
      circuit_masters,
    }),
  )

  const links: (DownloadEntry | void)[] = []

  const finalObject = {
    workouts: (
      await Promise.all(
        data.workouts.map(async (w): Promise<IWorkout> => {
          const link = await generateDownloadEntry(DownloadEntryType.workouts, payload.program, w.image_url)
          links.push(link)
          return {
            ...w,
            image_url: `/${link?.ZipPath}`,
            downloading: false,
            downloaded: true,
            equipment: await Promise.all(
              w.equipment.map(async (eq) => {
                const link2 = await generateDownloadEntry(DownloadEntryType.workouts, payload.program, eq.icon_url)
                links.push(link2)
                return { ...eq, icon_url: `/${link2?.ZipPath}` }
              }),
            ),
          }
        }),
      )
    ).reduce((total, curr) => ({ ...total, [curr.id]: curr }), {} as { [key: number]: IWorkout }),
    exercises: (
      await Promise.all(
        data.exercises.map(async (e) => {
          const link1 = await generateDownloadEntry(DownloadEntryType.workouts, payload.program, e.video_url)
          const link2 = await generateDownloadEntry(DownloadEntryType.workouts, payload.program, e.image_url)
          links.push(link1, link2)
          return { ...e, video_url: `/${link1?.ZipPath}`, image_url: `/${link2?.ZipPath}` }
        }),
      )
    ).reduce((total, curr) => ({ ...total, [curr.id]: curr }), {} as { [key: number]: IExercise }),
    cardio_exercises: (
      await Promise.all(
        data.cardio_exercises.map(async (e) => {
          const link = await generateDownloadEntry(DownloadEntryType.workouts, payload.program, e.icon_url)
          links.push(link)
          return { ...e, icon_url: `/${link?.ZipPath}` }
        }),
      )
    ).reduce((total, curr) => ({ ...total, [curr.id]: curr }), {} as { [key: number]: ICardioExercise }),
  }

  // console.log('we got this far?')

  // console.log('[900] links', links)

  download(links, finalObject, DownloadEntryType.week, true, null, { program: payload.program, week: payload.week_number })
})

export const fetchCompletions = createAsyncThunk(FETCH_COMPLETIONS, async (payload, thunkAPI) => {
  const response = await api.workouts.getCompletions()
  // TODO hack to remove hidden completions until api supports this filter
  let after = response.data.filter((c) => !c.hidden)
  thunkAPI.dispatch(workoutsSlice.actions.fetchCompletionsStarted(after))

  const links: (DownloadEntry | void)[] = []

  const finalObject = await Promise.all(
    after.map(async (c) => {
      const link = await generateDownloadEntry(DownloadEntryType.completions, null, c.category_icon_url)
      const link2 = await generateDownloadEntry(DownloadEntryType.completions, null, c.challenge_background_img!)
      if (link) {
        links.push(link)
      }
      if (link2) {
        links.push(link2)
      }

      return {
        ...c,
        category_icon_url: link ? `/${link.ZipPath}` : c.category_icon_url,
        challenge_background_img: link2 ? `/${link2.ZipPath}` : c.challenge_background_img,
      }
    }),
  )

  download(links, finalObject, DownloadEntryType.completions)
})

export const clearCheckmarks = createAsyncThunk(CLEAR_CHECKMARKS, async (payload: IClearCheckmarksPayload, thunkAPI) => {
  try {
    return await api.workouts.clearCompletions(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

// TODO pretty sure this never gets used. Deprecated in favor of offline action submitCompletion
export const createCompletion = createAsyncThunk(CREATE_COMPLETION, async (payload: ICreateCompletionPayload, thunkAPI) => {
  try {
    const response = await api.workouts.createCompletion(payload)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const hideCompletion = createAsyncThunk(HIDE_COMPLETION, async (payload: IHideCompletionPayload, thunkAPI) => {
  try {
    return await api.workouts.hideCompletion(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getWeek = createAsyncThunk(GET_WEEK, async (weekParams: IGetWeekPayload, thunkAPI) => {
  if (weekParams.week_id) {
    try {
      const data = await api.workouts.getWeek(weekParams)
      return data.week
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
})

export const getQuizQuestions = createAsyncThunk(GET_QUIZ_QUESTIONS, async (payload, thunkAPI) => {
  try {
    return await api.workouts.getQuizQuestions()
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    viewDownloadInfo: (state) => {
      state.downloadInfoViewed = true
    },
    setCurrentCategory: (state, action: PayloadAction<{ categoryId: number }>) => {
      state.currentCategory = action.payload.categoryId
    },
    setCurrentTrainer: (state, action: PayloadAction<ITrainer>) => {
      state.currentTrainer = action.payload
    },
    setCurrentProgram: (state, action: PayloadAction<IProgram>) => {
      state.currentProgram = action.payload
    },
    setCurrentWorkout: (
      state,
      action: PayloadAction<{ workoutId?: number; currentProgram: Partial<IProgram>; currentWorkout?: Partial<IWorkoutWithCircuits> }>,
    ) => {
      state.currentProgram = action.payload.currentProgram as IProgram

      let workout = {} as IWorkout
      if (action.payload.workoutId) {
        workout = state.workouts[action.payload.workoutId]
      }
      state.currentWorkout = (action.payload.currentWorkout as IWorkoutWithCircuits) ?? {
        ...workout,
        cardio: workout?.cardio?.map<ICardioWorkoutWithWalkthroughs>((cardio) => ({
          ...cardio,
          cardioType: state.cardio_types[cardio.cardio_type_id],
          walkthroughs: cardio.walkthroughs.map((w) => state.cardio_walkthroughs[w]),
        })),
        circuits: workout
          ?.circuits!.map((c) => state.circuits[c])
          .map<ICircuit>((circuit) => ({
            ...circuit,
            circuitMaster: state.circuit_masters[circuit.circuits_masters_id],
            exercises: circuit.exercises.map((e) => ({ ...e, exercise: state.exercises[e.exercise_id] })),
          })),
      }
    },
    clearDownloads: (state, action: PayloadAction<IClearDownloadsPayload>) => {
      delete state.categories[action.payload.programId]
    },
    clearChallengeMonth: (state) => {
      if (state.challengeMonth) {
        state.challengeMonth = undefined
      }
    },
    registerDownloads: (state, action: PayloadAction<IDownloadStateData>) => {
      if (state.downloads === null || state.downloads === undefined) {
        state.downloads = {}
      }
      state.downloads[action.payload.downloadId] = action.payload
    },
    updateProgress: (state, action: PayloadAction<Partial<IDownloadStateData>>) => {
      if (action.payload.downloadId && state.downloads[action.payload.downloadId]) {
        state.downloads[action.payload.downloadId].progress = action.payload.progress!
      }
    },
    downloadComplete: (state, action: PayloadAction<string>) => {
      // console.log('downloadComplete', action.payload)
      const dl = state.downloads[action.payload]

      switch (dl.type) {
        case DownloadEntryType.week:
          state.workouts = { ...state.workouts, ...dl.payloadToSave.workouts }
          state.exercises = { ...state.exercises, ...dl.payloadToSave.exercises }
          state.cardio_exercises = { ...state.cardio_exercises, ...dl.payloadToSave.cardio_exercises }
          break
        case DownloadEntryType.challenges:
          state.challengeMonth = dl.payloadToSave
          break
        case DownloadEntryType.trainers:
          state.programs = dl.payloadToSave.programs
          state.trainers = dl.payloadToSave.trainers
          break
        case DownloadEntryType.completions:
          state.completions = dl.payloadToSave
          break
        default:
          break
      }

      transactionHub.finishTransaction('workouts.download')
      delete state.downloads[action.payload]
    },
    fetchTrainersProgramsStarted: (state, action: PayloadAction<{ programs: Record<ProgramTypes, IProgram>; trainers: ITrainer[] }>) => {
      state.programs = action.payload.programs
      state.trainers = action.payload.trainers
    },
    fetchChallengesStarted: (state, action: PayloadAction<IChallengeMonth>) => {
      state.challengeMonth = action.payload
    },
    fetchCompletionsStarted: (state, action: PayloadAction<ICompletion[]>) => {
      state.completions = action.payload
    },
    fetchWeekStarted: (state, action) => {
      state.categories = {
        ...state.categories,
        [action.payload.program]: {
          ...state.categories?.[action.payload.program],
          [action.payload.week_number]: {
            ...action.payload.categories[action.payload.program][action.payload.week_number],
          },
        },
      }
      state.workouts = { ...state.workouts, ...action.payload.workouts }
      state.circuits = { ...state.circuits, ...action.payload.circuits }
      state.exercises = { ...state.exercises, ...action.payload.exercises }
      state.cardio_types = { ...state.cardio_types, ...action.payload.cardio_types }
      state.levels = { ...state.levels, ...action.payload.levels }
      state.cardio_walkthroughs = { ...state.cardio_walkthroughs, ...action.payload.cardio_walkthroughs }
      state.cardio_exercises = { ...state.cardio_exercises, ...action.payload.cardio_exercises }
      state.circuit_masters = { ...state.circuit_masters, ...action.payload.circuit_masters }
    },
    trainerDataExtracted: (state) => {
      state.trainersExtracted = true
    },
    initialWeeksDownloaded: (state) => {
      state.initialWeeksDownloaded = true
    },
    workoutStarted: () => {
      // this action is consumed by analyticsMiddleware.js purely for logging reasons
    },
    submitCompletion: {
      reducer: (state, action: PayloadAction<ICompletion>) => {
        state.completions = [...(state.completions || []), action.payload]
        // if submitting completion for a workout, make sure alternativeExercisesMap is reset
        state.alternativeExercisesMap = {}
      },
      prepare: (payload: ISubmitCompletionPayload) => {
        const id = nanoid()
        return {
          payload: { ...payload.local, id } as ICompletion,
          meta: {
            offline: {
              effect: { url: '/v4/workouts/log', method: 'POST', json: payload.server },
              commit: { type: SUBMIT_COMPLETION_COMMIT, meta: { id } },
              rollback: { type: SUBMIT_COMPLETION_ROLLBACK },
            },
          },
          error: null,
        }
      },
    },
    updateWorkoutProgress: (state, action: PayloadAction<IProgress>) => {
      const currentProgress = state.progress ?? {}
      state.progress = { ...currentProgress, ...action.payload }
    },
    clearWorkoutProgress: (state) => {
      state.progress = null
      state.alternativeExercisesMap = {}
    },
    clearAll: (state) => {
      return {
        ...initialState,
        trainers: state.trainers,
        programs: state.programs,
        trainersExtracted: state.trainersExtracted,
        currentTrainer: state.currentTrainer,
      }
    },
    checkExistingProgram: (state, action: PayloadAction<ProgramTypes | null>) => {
      const workoutGoal = action.payload
      const program = workoutGoal ? state.programs[workoutGoal] : null
      const trainers = state.trainers
      if ((!state.currentProgram || !state.currentTrainer) && program && trainers) {
        state.currentProgram = program
        state.currentTrainer = trainers.find((t) => t.programs.includes(program.id)) || null
      }
    },
    setAlternativeExercisesMap: (state, action: PayloadAction<ISetAlternativeExercisesMapPayload>) => {
      const { currentCircuit, currentExerciseIndex, exercise } = action.payload
      const newMap = { ...state.alternativeExercisesMap }
      if (!exercise.replacement_id) {
        delete newMap[currentCircuit][currentExerciseIndex]
      } else {
        newMap[currentCircuit] = {
          ...(newMap[currentCircuit] || {}),
          [currentExerciseIndex]: exercise,
        }
      }
      state.alternativeExercisesMap = newMap
    },
  },
  extraReducers(builder) {
    builder
      .addCase(SUBMIT_COMPLETION_COMMIT, (state, action: ActionWithPayload<typeof SUBMIT_COMPLETION_COMMIT, { data: ICompletion }>) => {
        // const completion = state.completions.find((c) => c.id === action.meta.id)
        state.completions = [...state.completions.filter((c) => c.id !== action.meta.id), { ...action.payload.data }]
      })
      .addCase(SUBMIT_COMPLETION_ROLLBACK, (state) => {
        return state
      })
      .addCase(clearCheckmarks.fulfilled, (state, action) => {
        if (action.payload) {
          const ids = action.payload.map((x) => x.id)
          state.completions = state.completions.map((c) => ({ ...c, hidden: ids.includes(c.id) ? true : c.hidden }))
        }
      })
      .addCase(hideCompletion.fulfilled, (state, action) => {
        if (action.payload) {
          const { payload } = action
          const completion = state.completions.find((c) => c.id === payload.id)
          if (completion) {
            state.completions = [...state.completions.filter((c) => c.id !== payload.id), { ...completion, hidden: true }]
          }
          // state.completions = [...state.completions.filter((c) => c.id !== payload.id), payload as Partial<ICompletion>]
        }
      })
      .addCase(createCompletion.fulfilled, (state, action) => {
        state.completions = [...state.completions, action.payload]
      })
      .addCase(getWeek.fulfilled, (state, action) => {
        if (action.payload) {
          const { payload } = action
          const key = `${payload.program}_${payload.resistance_bands}_${payload.week_number}`

          return {
            ...state,
            weeks: {
              ...state.weeks,
              [key]: payload,
            },
          }
        }
      })
      .addCase(getQuizQuestions.fulfilled, (state, action) => {
        state.quizQuestions = action.payload.data
      })
  },
})

export const {
  viewDownloadInfo,
  setCurrentCategory,
  setCurrentWorkout,
  clearDownloads,
  setCurrentTrainer,
  setCurrentProgram,
  trainerDataExtracted,
  initialWeeksDownloaded,
  submitCompletion,
  workoutStarted,
  updateWorkoutProgress,
  clearWorkoutProgress,
  clearChallengeMonth,
  clearAll,
  checkExistingProgram,
  setAlternativeExercisesMap,
} = workoutsSlice.actions

export default workoutsSlice.reducer
