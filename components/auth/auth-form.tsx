import { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client'
import classes from './auth-form.module.css'

async function createUser(email: string, password: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await response.json() as { message: string }
  // response.ok is true if status is in the range 200-299
  if (!response.ok) throw new Error(data.message || 'Something went wrong.')
  return data
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  function switchAuthModeHandler() {
    setIsLogin(prevState => !prevState)
  }

  async function submitHandler(e: FormEvent) {
    e.preventDefault()

    const email = emailInputRef.current!.value
    const password = passwordInputRef.current!.value

    // optional: add client-side validation here

    if (isLogin) {
      // log user in
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (!result?.error) {
        // if login is successful, redirect
        router.replace('/profile')
      } else {
        // todo: some kind of feedback, e.g. a toast notification
      }

      console.log(result)

    } else {
      // create new user
      try {
        const result = await createUser(email, password)
        console.log(result)
      } catch (error) {
        console.error(error) // todo: some kind of feedback, e.g. a toast notification
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm