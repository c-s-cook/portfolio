import Image from 'next/image'
import Link from 'next/link'


export default function Home() {
  return (
    <>
      <h1 className="text-big text-center">Home Page, bae-bay!</h1>
      <Link href={'/about'}>Go To About page...</Link>
    </>
  )
}
