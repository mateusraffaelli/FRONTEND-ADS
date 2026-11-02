import { type ReactNode } from 'react'

interface MainProps {
  children: ReactNode
}

const Main = ({ children }: MainProps) => {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
      {children}
    </main>
  )
}

export default Main
