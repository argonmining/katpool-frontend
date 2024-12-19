import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/ui/header'
import NotFoundImage from '@/public/images/404-illustration.svg'
import NotFoundImageDark from '@/public/images/404-illustration-dark.svg'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
      <Header />
      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="max-w-2xl m-auto mt-16">
            <div className="text-center px-4">
              <div className="inline-flex mb-8">
                <Image src={NotFoundImage} width={176} height={176} alt="404 illustration" className="block dark:hidden" />
                <Image src={NotFoundImageDark} width={176} height={176} alt="404 illustration dark" className="hidden dark:block" />
              </div>
              <div className="mb-6">Hmm...this page doesn't exist. Try searching for something else!</div>
              <Link href="/" className="btn bg-primary-500 hover:bg-primary-600 text-white">
                Back To Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}