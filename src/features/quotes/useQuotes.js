import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../auth/AuthContext'

export function useQuotes() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQuotes = async () => {
    if (!user) return
    try {
      const ref = collection(db, 'users', user.uid, 'quotes')
      const q = query(ref, orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuote = async (quoteId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'quotes', quoteId))
      setQuotes(prev => prev.filter(q => q.id !== quoteId))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchQuotes() }, [user])

  return { quotes, loading, deleteQuote, refetch: fetchQuotes }
}