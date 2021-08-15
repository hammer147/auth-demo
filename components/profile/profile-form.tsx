import { FormEvent, useRef } from 'react'
import { PasswordData } from '../../typings'
import classes from './profile-form.module.css'

type Props = {
  onChangePassword: (passwordData: PasswordData) => Promise<void>
}

function ProfileForm({ onChangePassword }: Props) {
  const oldPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)

  function submitHandler(e: FormEvent) {
    e.preventDefault()

    const oldPassword = oldPasswordRef.current!.value
    const newPassword = newPasswordRef.current!.value

    // optional: add client-side validation

    onChangePassword({ oldPassword, newPassword })

  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
