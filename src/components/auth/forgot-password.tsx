"use client"
import { useForm } from 'react-hook-form'
import CardWrapper from '../card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form-error'
import { FormSuccess } from '../form-success'
import { useAuthState } from '@/hooks/use-auth-state'
import { authClient } from '@/lib/auth-client'
import { ForgotPasswordSchema } from '@/helpers/zod/forgot-password-schema'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'


const ForgotPassword = () => {
  const locale = useLocale();
  const router = useRouter();
  const { error, success, loading, setError, setSuccess, setLoading, resetState } = useAuthState()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      resetState();
      setLoading(true);
      
      // Use $fetch to call the forget-password endpoint directly
      await authClient.$fetch("/forget-password", {
        method: "POST",
        body: {
          email: values.email,
          redirectTo: "/reset-password",
        },
        onSuccess: () => {
          setLoading(false);
          setSuccess("Reset password link has been sent")
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      });

    } catch (error) {
      console.error(error)
      setError("Something went wrong")
    }
  }

  return (
    <CardWrapper
      cardTitle='Forgot Password'
      cardDescription='Enter your email to send link to reset password'
      cardFooterDescription="Remember your password?"
      cardFooterLink={`${locale}/signin`}
      cardFooterLinkTitle='Signin'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="email"
                    placeholder='example@gmail.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={loading} type="submit" className='w-full'>Submit</Button>
        </form>
      </Form>

    </CardWrapper>
  )
}

export default ForgotPassword