import React, { Suspense, useEffect, useState } from 'react'
import { BASE_URL } from '../helpers/config'
import axios from 'axios'
import QuestionList from '../components/questions/QuestionList'
import { QuestionContext } from './questions/context/questionContext'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from './layouts/Spinner'

export default function Home() {
  const { isLoggedIn } = useSelector(state => state.user)
  const [questions, setQuestions] = useState()
  const [page, setPage] = useState(1)
  const [choosenTag, setChoosenTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [choosenUser, setChoosenUser] = useState('')
  const [all, setAll] = useState(false)


  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        if(choosenTag) {
          const response = await axios.get(`${BASE_URL}/tag/${choosenTag}/questions?page=${page}`)
          setQuestions(response.data)
          setAll(true)
          setLoading(false)
        }else if (choosenUser) {
          const response = await axios.post(`${BASE_URL}/user/questions?page=${page}`,
          {user_id: choosenUser})
          setQuestions(response.data)
          setAll(true)
          setLoading(false)
        }else {
          const response = await axios.get(`${BASE_URL}/questions?page=${page}`)
          setQuestions(response.data)
          setLoading(false)
        }
      } catch (error) { 
        console.log(error)
      }
    }
    fetchQuestions()
  }, [page, choosenTag, choosenUser])

  const fetchNextPrevQuestions = (link) => {
    const url = new URL(link)
    setPage(url.searchParams.get('page'))
  }

  const filterQuestionsByUser = (user) => {
    setChoosenTag('')
    setPage(1)
    setChoosenUser(user)
  }

  const filterQuestionsByTag = (tag) => {
    setChoosenTag(tag)
    setPage(1)
    setChoosenUser('')
  }

  const clearFilters = () => {
    setChoosenTag('')
    setChoosenUser('')
    setPage(1)
    setAll(false)
  }

  return (
    <div>
      <QuestionContext.Provider value={{
        questions, fetchNextPrevQuestions, filterQuestionsByTag,
        filterQuestionsByUser
      }}>
        <div className="row my-5">
          <div className="col-md-10 mx-auto">
            {
              isLoggedIn && <div className="d-flex justify-content-end mb-2">
                <Link to="/ask" className='btn btn-primary'>
                  <i className="bi bi-pencil"></i> Ask 
                </Link>
              </div>
            }
            {
              all && <div className="row">
                <div className="col-md-12">
                  <div className="mb-2">
                    <button className="btn btn-dark" 
                      onClick={() => clearFilters()}
                      >
                      All Questions
                    </button>
                  </div>
                </div>
              </div>
            }
            {
              loading ? 
                <div className="d-flex justify-content-center my-3">
                  <Spinner />
                </div>
                :
                <QuestionList />
            }
          </div>
        </div>
      </QuestionContext.Provider>
    </div>
  )
}
