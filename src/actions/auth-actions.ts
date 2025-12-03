'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticateAdmin(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/admin/dashboard',
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales incorrectas.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}
