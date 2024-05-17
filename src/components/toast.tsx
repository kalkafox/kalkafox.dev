import { useEffect } from 'react'
import { Toaster } from './ui/sonner'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from './ui/alert-dialog'
import { AlertDialogHeader, AlertDialogFooter } from './ui/alert-dialog'

import Image from './image'

function FakeError() {
  return (
    <>
      <div className="flex items-center">
        {/* <Icon className='w-5 h-5' icon='material-symbols:error' /> */}
        Oh no! The dom encountered an error!
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="absolute right-4 rounded-lg bg-stone-900 p-2">
          Show more
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>haha</AlertDialogTitle>
            <AlertDialogDescription>
              just kidding lol
              <Image
                className="my-4 rounded-lg"
                src="https://t4.ftcdn.net/jpg/04/20/82/69/360_F_420826948_FtEDTDts86umKGz9Zpybad5XTe4Wmo1s.jpg"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function Toast() {
  useEffect(() => {
    toast.warning(<FakeError />)
  }, [])

  return <Toaster theme={'dark'} position="bottom-right" richColors />
}

export default Toast
