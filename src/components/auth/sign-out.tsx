"use client"

import { Button } from '../ui/button'
import { authClient, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const SignOut = () => {
  const locale = useLocale();
    const router = useRouter()
    const session = authClient.useSession()

    if(!session.data) {
      return (
        <Button onClick={() => {router.push(`/signin`)}}>
          Login
        </Button>
      )
    }

  return (
    <Button
    onClick={async() => {await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(`/signin`)
        }
      }
    })}}
    >Logout</Button>
  )
}

export default SignOut