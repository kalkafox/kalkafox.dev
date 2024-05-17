import Image from './image'

function Fox({ image }: { image: string }) {
  return <Image src={image} className="w-80 rounded-lg" />
}

export default Fox
