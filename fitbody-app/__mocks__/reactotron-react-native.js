export default {
  setAsyncStorageHandler: () => ({
    configure: () => ({
      use: () => ({
        useReactNative: () => ({
          connect: () => ({
            createEnhancer: jest.fn(),
          }),
        }),
      }),
    }),
  }),
  clear: () => jest.fn(),
}
