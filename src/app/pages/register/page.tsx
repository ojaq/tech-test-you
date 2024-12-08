"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const isFormValid =
    formData.email &&
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://techtest.youapp.ai/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.status === 201 && data.message === 'User has been created successfully') {
        setMessage('Registration successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/pages/login')
        }, 1000)
      } else if (data.message === 'User already exists') {
        setMessage('User already exists. Please choose another username or email.')
      } else {
        setMessage(data.message || 'Failed to register. Please try again.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center text-white"
      style={{
        background: 'radial-gradient(121.73% 121.49% at 100% -3.39%, #1F4247 0%, #0D1D23 56.18%, #09141A 100%)',
      }}
    >
      <div className="w-full max-w-md px-6 py-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 ms-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 mb-3 bg-white bg-opacity-5 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm text-slate-300"
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Create Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-4 mb-3 bg-white bg-opacity-5 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm text-slate-300"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 mb-3 bg-white bg-opacity-5 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm text-slate-300"
            />
            <div
              className="absolute right-4 cursor-pointer"
              style={{
                top: 'calc(50% - 15px)'
              }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <FiEyeOff size={20} className="text-slate-300" />
              ) : (
                <FiEye size={20} className="text-slate-300" />
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 mb-8 bg-white bg-opacity-5 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm text-slate-300"
            />
            <div
              className="absolute right-4 cursor-pointer"
              style={{
                top: 'calc(50% - 25px)'
              }}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} className="text-slate-300" />
              ) : (
                <FiEye size={20} className="text-slate-300" />
              )}
            </div>
          </div>
          {message && <p className="text-sm text-center text-red-500 mb-6">{message}</p>}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              isFormValid && !loading ? 'shadow-lg' : ''
            }`}
            style={{
              background: 'linear-gradient(108.32deg, #62CDCB 24.88%, #4599DB 78.49%)',
              boxShadow: isFormValid && !loading ? '0 4px 15px rgba(70, 200, 220, 0.5)' : 'none',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              opacity: isFormValid && !loading ? 1 : 0.6,
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-10 text-sm text-center text-white">
          Have an account?{' '}
          <a href="/pages/login" className="text-teal-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}
