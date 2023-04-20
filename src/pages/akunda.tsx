import { animated as a, useSpring } from '@react-spring/web'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'

import images from '@/data/images.json'

import { bgImageAtom, previousPageAtom, showLoadSpinnerAtom } from '@/util/atom'
import { poppins } from '@/util/font'
import { useAtom, useSetAtom } from 'jotai'
import Head from 'next/head'

function Akunda() {
  const router = useRouter()

  const [encryptMode, setEncryptMode] = useState(true)

  const [previousPage, setPreviousPage] = useAtom(previousPageAtom)

  const [showLoadSpinner, setShowLoadSpinner] = useAtom(showLoadSpinnerAtom)

  const setBgImage = useSetAtom(bgImageAtom)

  const multiLineInputRef = useRef<HTMLTextAreaElement>(null)

  const [showMultiLineInput, setShowMultiLineInput] = useState(false)

  const [decrypt, setDecrypt] = useState('')

  const [encrypt, setEncrypt] = useState('')

  const [key, setKey] = useState('')

  const placeholderKey = useMemo(() => {
    const key = Buffer.from('kalkafox').toString('base64')
    return key
  }, [])

  const [decryptMessage, setDecryptMessage] = useState('')
  const [encryptMessage, setEncryptMessage] = useState('')

  const [buttonSelectionSpring, setButtonSelectionSpring] = useSpring(() => ({
    scale: 1,
    x: 0,
    config: {
      friction: 10,
    },
  }))

  const [encryptSpring, setEncryptSpring] = useSpring(() => ({
    color: '#eeeeee',
    scale: 1,
    config: {
      friction: 20,
    },
  }))

  const [decryptSpring, setDecryptSpring] = useSpring(() => ({
    color: '#eeeeee',
    scale: 1,
    config: {
      friction: 20,
    },
  }))

  const [colorSpring, setColorSpring] = useSpring(() => ({
    color: '#eeeeee',
    config: {
      friction: 20,
    },
  }))

  const [multiLineInputSpring, setMultiLineInputSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: {
      friction: 20,
    },
  }))

  const [loadSpring, setLoadSpring] = useSpring(() => ({
    opacity: 1,
    scale: 1,
  }))

  const [mainMenuSpring, setMainMenuSpring] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: {
      friction: 20,
    },
  }))

  useEffect(() => {
    setMainMenuSpring.start({
      opacity: 1,
      scale: 1,
    })
  }, [setMainMenuSpring])

  useEffect(() => {
    window.localStorage.getItem('akunda-key') &&
      setKey(window.localStorage.getItem('akunda-key') || '')
  }, [])

  useEffect(() => {
    if (key.length === decryptMessage.length) {
      // do nothing for now
    }

    const messageBuffer = Buffer.from(decryptMessage, 'base64')
    const keyBuffer = Buffer.from(key, 'base64')

    const buffer = Buffer.alloc(messageBuffer.length)

    messageBuffer.forEach((byte, index) => {
      const keyByte = keyBuffer[index]
      const decodedByte = byte ^ keyByte
      buffer[index] = decodedByte
    })

    setDecrypt(buffer.toString())
  }, [key, decryptMessage])

  useEffect(() => {
    if (key.length === encryptMessage.length) {
      // do nothing for now
    }

    const messageBuffer = Buffer.from(encryptMessage)
    const keyBuffer = Buffer.from(key, 'base64')

    const buffer = Buffer.alloc(messageBuffer.length)

    messageBuffer.forEach((byte, index) => {
      const keyByte = keyBuffer[index]
      const encodedByte = byte ^ keyByte
      buffer[index] = encodedByte
    })
    setEncrypt(buffer.toString('base64'))
  }, [key, encryptMessage])

  const openMultiLineInput = () => {
    setShowMultiLineInput(true)
  }

  useEffect(() => {
    if (showMultiLineInput) {
      setMultiLineInputSpring.start({
        opacity: 1,
        scale: 1,
      })
    }
  }, [showMultiLineInput, setMultiLineInputSpring])

  useEffect(() => {
    if (encryptMode) {
      setEncryptSpring.start({
        color: '#333333',
        scale: 1,
      })
      setDecryptSpring.start({
        color: '#eeeeee',
        scale: 0.8,
      })
    } else {
      setEncryptSpring.start({
        color: '#eeeeee',
        scale: 0.8,
      })
      setDecryptSpring.start({
        color: '#333333',
        scale: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptMode])
  return (
    <>
      <Head>
        <title>Clarity comes after the storm.</title>
      </Head>
      <div className="absolute h-full w-full">
        <a.div
          style={mainMenuSpring}
          className="absolute left-0 right-0 top-20 m-auto h-auto w-[40%] rounded-xl bg-zinc-900/50 backdrop-blur-lg portrait:w-[80%]"
        >
          <button
            className="absolute left-0 top-0"
            onClick={() => {
              setShowLoadSpinner(true)
              setBgImage(images.bg_1)
              setPreviousPage(router.pathname)
              setMainMenuSpring.start({
                opacity: 0,
                scale: 0.8,
                onChange: (e, ctrl) => {
                  if (e.value.opacity < 0.4) {
                    ctrl.set({
                      opacity: 0,
                      scale: 0.8,
                    })
                    router.back()
                  }
                },
              })
            }}
          >
            <Icon
              icon="material-symbols:arrow-back"
              className="m-2 h-4 w-4 text-zinc-300"
            />
          </button>
          <div className={`m-4 text-center ${poppins.className} text-zinc-300`}>
            Clarity comes after the storm.
          </div>
          <a.div
            style={buttonSelectionSpring}
            className="absolute left-0 right-20 m-auto inline w-20 rounded-xl bg-zinc-400 text-center text-zinc-400"
          >
            .
          </a.div>
          <a.button
            style={encryptSpring}
            onClick={() => {
              setButtonSelectionSpring.start({
                x: 0,
              })
              setEncryptMode(true)
            }}
            className={`absolute left-0 right-20 m-auto inline w-20 text-center ${poppins.className} text-zinc-900`}
          >
            Encrypt
          </a.button>
          <a.button
            style={decryptSpring}
            onClick={() => {
              setButtonSelectionSpring.start({
                x: 80,
              })
              setEncryptMode(false)
            }}
            className={`absolute left-20 right-0 m-auto inline w-20 text-center ${poppins.className} text-zinc-300`}
          >
            Decrypt
          </a.button>
          <br />
          <div className="m-4">
            <form className="w-[90%]">
              <div className="grid grid-cols-2 gap-2">
                <Icon
                  icon="material-symbols:key"
                  className="w-full text-4xl text-zinc-300"
                />
                <code>
                  <textarea
                    className="w-full rounded-lg bg-zinc-900/50 p-2 text-zinc-50"
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value)
                    }}
                    placeholder={`e.g, ${placeholderKey}...`}
                  />
                </code>
                <Icon
                  icon="mdi:message-lock-outline"
                  className="inline w-full text-4xl text-zinc-300"
                  inline={true}
                />
                {/* resizable input box */}
                <code>
                  <textarea
                    className="w-full resize-none rounded-lg bg-zinc-900/50 p-2 text-zinc-50"
                    onChange={(e) => {
                      encryptMode
                        ? setEncryptMessage(e.target.value)
                        : setDecryptMessage(e.target.value)
                    }}
                    value={encryptMode ? encryptMessage : decryptMessage}
                    onDoubleClick={() => {
                      openMultiLineInput()
                    }}
                  />
                </code>
              </div>
            </form>

            <div className="relative grid grid-flow-col justify-center gap-2">
              <a.button
                style={colorSpring}
                onClick={() => {
                  if (key.length === 0) {
                    return
                  }
                  setColorSpring.start({
                    color: '#22ee22',
                    onRest: () => {
                      setTimeout(() => {
                        setColorSpring.start({
                          color: '#eeeeee',
                        })
                      }, 500)
                    },
                  })
                  window.localStorage.setItem('akunda-key', key)
                }}
              >
                <Icon
                  icon="mdi:content-save-check-outline"
                  className="text-xl"
                />
              </a.button>
              <button>
                <input type="checkbox" className="hidden" />
              </button>
            </div>

            <hr className="mx-auto my-4 h-1 w-48 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />
            <div className="m-4">
              <Icon
                icon="mdi:message-reply-outline"
                className="w-full text-4xl text-zinc-300"
              />
              <code>
                <textarea
                  disabled={true}
                  value={encryptMode ? encrypt : decrypt}
                  className="w-full resize-none rounded-lg bg-zinc-900/50 p-2 text-zinc-50"
                />
              </code>
              <code>
                <textarea
                  disabled={true}
                  value={
                    encryptMode
                      ? Buffer.from(encrypt, 'base64').toString('utf8')
                      : Buffer.from(decrypt, 'base64').toString('utf8')
                  }
                  className="w-full resize-none rounded-lg bg-zinc-900/50 p-2 text-zinc-50"
                />
              </code>
            </div>
          </div>
        </a.div>
      </div>
      {showMultiLineInput && (
        <div
          onClick={(e) => {
            if (e.target !== multiLineInputRef.current) {
              setMultiLineInputSpring.start({
                opacity: 0,
                scale: 0.8,
                onRest: () => {
                  setShowMultiLineInput(false)
                },
              })
            }
          }}
          className="fixed h-full w-full bg-zinc-900/0"
        >
          <a.div
            style={multiLineInputSpring}
            className="fixed left-0 right-0 top-20 m-auto h-auto w-[38%] rounded-xl bg-zinc-900/50 backdrop-blur-lg portrait:w-[80%]"
          >
            <code>
              <textarea
                ref={multiLineInputRef}
                className="h-80 w-full rounded-lg bg-zinc-900/50 p-2 text-zinc-50"
                value={encryptMode ? encryptMessage : decryptMessage}
                onChange={(e) => {
                  encryptMode
                    ? setEncryptMessage(e.target.value)
                    : setDecryptMessage(e.target.value)
                }}
              />
            </code>
          </a.div>
        </div>
      )}
    </>
  )
}

export default Akunda
