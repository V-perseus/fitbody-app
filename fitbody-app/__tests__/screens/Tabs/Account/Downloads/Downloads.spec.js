import { MockedNavigator, render, act, cleanup, fireEvent } from '../../../../../testUtils'
import RNFS from 'react-native-fs'

import Downloads from '../../../../../src/screens/tabs/account/Downloads'

describe('Downloads screen', () => {
  let component = null
  beforeEach(() => {
    component = MockedNavigator({
      component: Downloads,
      preloadedState: {
        data: {
          user: {
            workout_goal: 'TONE',
          },
          workouts: {
            programs: {
              SHRED: { id: 1, title: 'Shred', sort_order: 1, slug: 'SHRED' },
              TONE: { id: 2, title: 'Tone', sort_order: 2, slug: 'TONE' },
            },
            trainers: [
              {
                programs: [2],
                sort_order: 1,
              },
              {
                programs: [1],
                sort_order: 2,
              },
            ],
          },
        },
      },
    })
  })
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', async () => {
    const tree = render(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render header', async () => {
    const { findByText } = render(component)
    await findByText('DOWNLOADS')
    await findByText(/Please note you cannot delete data for the workout program you currently have open/gi)
  })

  it('should respond with mocked file data', async () => {
    RNFS.readDir.mockResolvedValue([
      {
        ctime: '2022-05-11T16:06:51.804Z',
        mtime: '2022-05-11T16:07:14.512Z',
        name: 2,
        path: '/var/mobile/Containers/Data/Application/6A864251-F3D2-433C-ACB1-91D3A0A891A2/Documents/assets/workouts/2',
        size: 8032,
        isFile: jest.fn(),
        isDirectory: () => true,
      },
    ])
    // .mockResolvedValueOnce([
    //   {
    //     ctime: '2022-05-11T16:07:14.298Z',
    //     mtime: '2022-05-11T23:07:06.000Z',
    //     name: 'kYpeVQ2Xmm0rlqTUERGTI70LhDuRE2kdPiNGxnVJ.mp4',
    //     path: '/var/mobile/Containers/Data/Application/6A864251-F3D2-433C-ACB1-91D3A0A891A2/Documents/assets/workouts/2/kYpeVQ2Xmm0rlqTUERGTI70LhDuRE2kdPiNGxnVJ.mp4',
    //     size: 90825,
    //     isFile: jest.fn(),
    //     isDirectory: jest.fn(),
    //   },
    // ])
    // const tree = render(component)
    const { findByText } = render(component)
    await act(async () => {
      await findByText(/TONE/i)
    })
  })

  it('should nav to delete warning modal', async () => {
    RNFS.readDir.mockResolvedValue([
      {
        ctime: '2022-05-11T16:06:51.804Z',
        mtime: '2022-05-11T16:07:14.512Z',
        name: 2,
        path: '/var/mobile/Containers/Data/Application/6A864251-F3D2-433C-ACB1-91D3A0A891A2/Documents/assets/workouts/2',
        size: 8032,
        isFile: jest.fn(),
        isDirectory: () => true,
      },
      {
        ctime: '2022-05-11T16:06:51.804Z',
        mtime: '2022-05-11T16:07:14.512Z',
        name: 1,
        path: '/var/mobile/Containers/Data/Application/6A864251-F3D2-433C-ACB1-91D3A0A891A2/Documents/assets/workouts/1',
        size: 8032,
        isFile: jest.fn(),
        isDirectory: () => true,
      },
    ])
    const { findByTestId, findByText } = render(component)
    await act(async () => {
      const deleteBtn = await findByTestId(/Shred/i)
      await fireEvent.press(deleteBtn)
      const modalBody = await findByText('You are about to clear all downloads for this program. This will not clear any workout history.')
      expect(modalBody).toBeTruthy()
    })
  })
})
