import { useEffect, useState } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../auth/AuthContext'

export function useTheme() {
  const { user } = useAuth()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const saved = snap.data().theme || 'dark'
        setTheme(saved)
        applyTheme(saved)
      }
    }
    load()
  }, [user])

  const applyTheme = (t) => {
    if (t === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { theme: next })
    }
  }

  return { theme, toggleTheme }
}