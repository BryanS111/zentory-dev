import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../auth/AuthContext'

export function useQuote(quoteId) {
  const { user } = useAuth()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !quoteId) return

    const fetch = async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'quotes', quoteId)
        const snap = await getDoc(ref)
        if (snap.exists()) setQuote({ id: snap.id, ...snap.data() })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user, quoteId])

  return { quote, loading }
}