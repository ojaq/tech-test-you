import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/pages/login')
  return null
}
