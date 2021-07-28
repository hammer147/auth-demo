import { ReactNode } from 'react'
import MainNavigation from './main-navigation'

type Props = { children: ReactNode }

function Layout({ children }: Props) {
  return (
    <>
      <MainNavigation />
      <main>{children}</main>
    </>
  )
}

export default Layout
