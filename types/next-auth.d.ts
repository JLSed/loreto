import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      name: string
      image?: string
      role: number
    }
  }
  interface User {
    email: string
    name: string
    image?: string
    role: number
  }

  interface Profile {
    id: string
    name: string
    email: string
    image: string
    given_name: string
    family_name: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: number
  }
}
