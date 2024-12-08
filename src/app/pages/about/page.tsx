"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiChevronLeft, FiEdit3, FiPlus } from 'react-icons/fi'

function calculateHoroscope(birthday: string) {
  const [day, month] = birthday.split(' ').map(Number)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini'
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Libra'
  if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return 'Scorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces'
}

function calculateZodiac(year: number) {
  const zodiacs = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ]
  return zodiacs[(year - 4) % 12]
}

export default function AboutPage() {
  const [editing, setEditing] = useState(false)
  const [showInterestsModal, setShowInterestsModal] = useState(false)
  const [interestsInput, setInterestsInput] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [formData, setFormData] = useState({
    displayName: '',
    gender: '',
    birthday: '',
    horoscope: '',
    zodiac: '',
    height: '',
    weight: '',
    image: null as string | null,
  })

  const [horoscope, setHoroscope] = useState('')
  const [zodiac, setZodiac] = useState('')
  const [profile, setProfile] = useState({ email: '', username: '', interests: [] })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('x-access-token')
    if (!token) {
      alert("You haven't logged in. Redirecting to login page.")
      router.push('/pages/login')
      return
    }

    fetchProfile(token)
  }, [])

  useEffect(() => {
    if (formData.birthday) {
      const [day, month, year] = formData.birthday.split('-').map(Number)
      const calculatedHoroscope = calculateHoroscope(`${day} ${month}`)
      const calculatedZodiac = calculateZodiac(year)
  
      setHoroscope(calculatedHoroscope)
      setZodiac(calculatedZodiac)
  
      setFormData((prev) => ({
        ...prev,
        horoscope: calculatedHoroscope,
        zodiac: calculatedZodiac,
      }))
    }
  }, [formData.birthday])

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch('https://techtest.youapp.ai/api/getProfile', {
        headers: { 'x-access-token': token },
      })
      
      if (response.status === 500) {
        alert('Server error occurred. Redirecting to login page.')
        router.push('/pages/login')
        return
      }
  
      const result = await response.json()
  
      if (result.auth === false) {
        alert(result.message)
        router.push('/pages/login')
      } else if (response.ok) {
        setProfile(result.data)
        setFormData((prev) => ({
          ...prev,
          displayName: result.data.username,
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      alert('An error occurred. Redirecting to login page.')
      router.push('/pages/login')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const addInterest = () => {
    if (interestsInput.trim() && !interests.includes(interestsInput.trim())) {
      setInterests((prev) => [...prev, interestsInput.trim()])
    }
    setInterestsInput('')
  }

  const removeInterest = (interest: string) => {
    setInterests((prev) => prev.filter((item) => item !== interest))
  }

  const handleBack = () => {
    localStorage.removeItem('x-access-token')
    sessionStorage.removeItem('x-access-token')
    router.push('/pages/login')
  }

  const hasData = Boolean(formData.gender || formData.birthday || formData.height || formData.weight)

  return (
    <div className="min-h-screen bg-[#09141A] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-6 w-full">
        <button onClick={handleBack} className="text-white flex items-center">
          <FiChevronLeft size={20} /> Back
        </button>
        <p className="text-white absolute left-1/2 transform -translate-x-1/2">
          @{formData.displayName || '-'}
        </p>
      </div>

      {/* Top Card */}
      <div
        className={`bg-[#0E191F] rounded-lg p-4 py-4 mx-4 mb-4 relative bg-cover bg-center ${hasData && formData.image && formData.birthday ? 'h-60' : 'h-48'}`}
        style={{
          backgroundImage: formData.image ? `url(${formData.image})` : 'none',
        }}
      >
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold mb-1">
            @{formData.displayName || '-'}
            {hasData && formData.birthday && (
              <span className="text-white font-bold mb-1">
                , {new Date().getFullYear() - new Date(formData.birthday).getFullYear()}
              </span>
            )}
          </p>
          {hasData && (
            <>
              <p className="text-gray-300 text-sm">{formData.gender || '--'}</p>
              <div className="flex space-x-2 mt-2">
                {horoscope && <span className="bg-[#1C201C] text-sm p-2 px-4 rounded-full">{horoscope}</span>}
                {zodiac && <span className="bg-[#1C201C] text-sm p-2 px-4 rounded-full">{zodiac}</span>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4 px-4">
        <div className="bg-[#0E191F] rounded-lg p-4 px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">About</h2>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                background: 'linear-gradient(74.08deg, #94783E -6.8%, #F3EDA6 16.76%, #F8FAE5 30.5%, #FFE2BE 49.6%, #D5BE88 78.56%, #F8FAE5 89.01%, #D5BE88 100.43%)',
                cursor: 'pointer',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {editing ? 'Save & Update' : <FiEdit3 size={16} />}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="image-upload"
                  className="w-16 h-16 rounded-3xl bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FiPlus size={24}
                      className="cursor-pointer"
                      style={{
                        background: 'linear-gradient(74.08deg, #94783E -6.8%, #F3EDA6 16.76%, #F8FAE5 30.5%, #FFE2BE 49.6%, #D5BE88 78.56%, #F8FAE5 89.01%, #D5BE88 100.43%)',
                        cursor: 'pointer',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    />
                  )}
                </label>
                <span className="text-white">Add image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {[
                { label: 'Display Name:', name: 'displayName', type: 'text', placeholder: 'Enter Name' },
                { label: 'Gender:', name: 'gender', type: 'select', options: ['', 'Male', 'Female'] },
                { label: 'Birthday:', name: 'birthday', type: 'date' },
                { label: 'Horoscope:', name: 'horoscope', type: 'text', placeholder: '--', disabled: true, value: formData.horoscope },
                { label: 'Zodiac:', name: 'zodiac', type: 'text', placeholder: '--', disabled: true, value: formData.zodiac },
                { label: 'Height (cm):', name: 'height', type: 'number', placeholder: 'Add height' },
                { label: 'Weight (kg):', name: 'weight', type: 'number', placeholder: 'Add weight' },
              ].map(({ label, name, ...props }, idx) => (
                <div className="flex items-center space-x-2" key={idx}>
                  <p className="text-gray-500 text-sm w-4/12">{label}</p>
                  {props.type === 'select' ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-8/12 bg-[#1A252A] border border-gray-500 rounded-md px-2 py-2 text-white text-end text-sm"
                    >
                      {props.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option || 'Select Gender'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...props}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-8/12 bg-[#1A252A] border border-gray-500 rounded-md px-2 py-2 text-white text-end text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : hasData ? (
            <div className="space-y-2">
              <p className="text-gray-400">Birthday: <span className="text-white">{formData.birthday || '--'} (Age {formData.birthday ? `${new Date().getFullYear() - new Date(formData.birthday).getFullYear()}` : '--'})</span></p>
              <p className="text-gray-400">Horoscope: <span className="text-white">{horoscope || '--'}</span></p>
              <p className="text-gray-400">Zodiac: <span className="text-white">{zodiac || '--'}</span></p>
              <p className="text-gray-400">Height: <span className="text-white">{formData.height ? `${formData.height} cm` : '--'}</span></p>
              <p className="text-gray-400">Weight: <span className="text-white">{formData.weight ? `${formData.weight} kg` : '--'}</span></p>
            </div>
          ) : (
            <p className="text-gray-400">Add in to help others know you better</p>
          )}
        </div>

        {/* Interest Section */}
        <div className="bg-[#0E191F] rounded-lg p-4 px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Interest</h2>
            <button
              onClick={() => setShowInterestsModal(true)}
              style={{
                background: 'linear-gradient(74.08deg, #94783E -6.8%, #F3EDA6 16.76%, #F8FAE5 30.5%, #FFE2BE 49.6%, #D5BE88 78.56%, #F8FAE5 89.01%, #D5BE88 100.43%)',
                cursor: 'pointer',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <FiEdit3 size={16} />
            </button>
          </div>

          {interests.length ? (
            <div className="flex flex-wrap mt-2 space-x-2">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-[#1C272C] text-white text-sm font-semibold py-2 px-3 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-2">Add in your interest to find a better match</p>
          )}
        </div>

        {showInterestsModal && (
          <div
            className="fixed inset-0 z-50"
            style={{
              background: 'radial-gradient(121.73% 121.49% at 100% -3.39%, #1F4247 0%, #0D1D23 56.18%, #09141A 100%)',
            }}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between font-medium">
                <button 
                  onClick={() => setShowInterestsModal(false)} 
                  className="text-white flex items-center"
                >
                  <FiChevronLeft size={20}/> Back
                </button>
                <button 
                  onClick={() => setShowInterestsModal(false)} 
                  className="font-medium"
                  style={{
                    // background: 'linear-gradient(74.08deg, #94783E -6.8%, #F3EDA6 16.76%, #F8FAE5 30.5%, #FFE2BE 49.6%, #D5BE88 78.56%, #F8FAE5 89.01%, #D5BE88 100.43%)',
                    background: 'linear-gradient(108.32deg, #62CDCB 24.88%, #4599DB 78.49%)',
                    cursor: 'pointer',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Save
                </button>
              </div>

              {/* Content */}
              <div className="px-4 mt-20">
                <h3 className="font-semibold px-2"
                  style={{
                    background: 'linear-gradient(74.08deg, #94783E -6.8%, #F3EDA6 16.76%, #F8FAE5 30.5%, #FFE2BE 49.6%, #D5BE88 78.56%, #F8FAE5 89.01%, #D5BE88 100.43%)',
                    cursor: 'pointer',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >Tell everyone about yourself</h3>
                <h2 className="text-white text-2xl px-2 mt-2 font-bold">What interest you?</h2>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {interests.map((interest, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-slate-800 text-white text-sm py-2 px-4 rounded-lg"
                    >
                      {interest}
                      <button 
                        onClick={() => removeInterest(interest)}
                        className="ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && interestsInput.trim()) {
                      addInterest()
                    }
                  }}
                  className="w-full px-5 py-4 bg-white bg-opacity-5 rounded-xl mt-2 focus:ring-2 outline-none text-slate-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
