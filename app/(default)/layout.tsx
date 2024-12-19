import Header from '@/components/ui/header'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
      {/*  Site header */}
      <Header />

      <main className="grow">
        {children}
      </main>
    </div>
  )
}
