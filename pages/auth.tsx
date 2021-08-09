import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
// import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
import AuthForm from '../components/auth/auth-form'

function AuthPage() {
  // const [isLoading, setIsLoading] = useState(true)
  // const router = useRouter()

  // useEffect(() => {
  //   getSession().then(session => {
  //     if (session) {
  //       router.replace('/')
  //     } else {
  //       setIsLoading(false)
  //     }
  //   })
  // }, [router])

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }

  return <AuthForm />
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { session } // used by Provider in _app.tsx
  }

}

export default AuthPage
