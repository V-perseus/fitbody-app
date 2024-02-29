import React, { memo } from 'react'
import { SvgUri } from 'react-native-svg'
import { resolveLocalUrl } from '../../../services/helpers'

// const cache = {}

interface ISvgUriLocalProps {
  uri: string
  [key: string]: any
}
export const SvgUriLocal: React.FC<ISvgUriLocalProps> = memo(({ uri, ...rest }) => {
  const resolvedUri = resolveLocalUrl(uri)

  return <SvgUri {...rest} uri={resolvedUri} />

  // const [contents, setContents] = useState(null)

  // useEffect(() => {
  //   const getContents = async () => {
  //     if (cache[props.uri]) {
  //       setContents(cache[props.uri])
  //     } else {
  //       const content = await RNFS.readFile(resolveLocalUrl(props.uri), 'ascii')
  //       cache[props.uri] = content

  //       setContents(content)
  //     }
  //   }

  //   if (!props.uri.startsWith('http')) {
  //     getContents()
  //   }
  // }, [props.uri])

  // if (props.uri.startsWith('http')) {
  //   return <SvgUri {...props} />
  // } else {
  //   return (
  //     <View {...props.style}>
  //       <SvgXml {...props} xml={contents} />
  //     </View>
  //   )
  // }
})
