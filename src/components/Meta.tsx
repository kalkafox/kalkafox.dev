import { fingerprintAtom, splashTextAtom } from '@/util/atom'
import { useAtomValue, useSetAtom } from 'jotai'
import Head from 'next/head'
import { useEffect } from 'react'

import FingerprintJS from '@fingerprintjs/fingerprintjs'

function Meta() {
  const splashText = useAtomValue(splashTextAtom)
  const setFingerprint = useSetAtom(fingerprintAtom)

  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        setFingerprint(result.visitorId)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>{`${splashText.replaceAll('`', '')} | kalkafox.dev`}</title>
      </Head>
    </>
  )
}

export default Meta
