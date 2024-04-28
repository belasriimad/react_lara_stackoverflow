import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from "axios"
import { BASE_URL, getConfig } from "../../helpers/config"
import { Parser } from 'html-to-react'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../layouts/Spinner'
import { toast } from 'react-toastify'
import Answer from '../answers/Answer'
import { AnswerContext } from '../answers/context/answerContext'
import AddAnswer from '../answers/AddAnswer'
import { bookmark } from '../../redux/slices/bookmarkSlice'

export default function Question() {
    const { isLoggedIn, token } = useSelector(state => state.user)
    const { bookmarked } = useSelector(state => state.bookmark)
    const[question, setQuestion] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { slug } = useParams()
    const[answer, setAnswer] = useState({
        body: ''
    })
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch()
    const exists = bookmarked.find(item => item.id === question?.id)

    useEffect(() => {
        const fetchQuestionBySlug = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${BASE_URL}/question/${slug}/show`)
                setQuestion(response.data.data)
                setLoading(false)
            } catch (error) { 
                if(error?.response?.status === 404) {
                    setError('The question you are looking for does not exist')
                }
                setLoading(false)
                console.log(error)
            }
        }
        fetchQuestionBySlug()
    }, [slug])

    const voteQuestion = async (slug, vote) => {
        try {
            const response = await axios.put(`${BASE_URL}/${vote}/${slug}/question`,null,
            getConfig(token))
            if(response.data.error) {
                toast.error(response.data.error)
            }else {
                setQuestion(response.data.data)
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const storeAnswer = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])
        try {
            const response = await axios.post(`${BASE_URL}/answer/${question.slug}/store`,
                answer,getConfig(token))
            setQuestion(response.data.data)
            setSubmitting(false)
            setAnswer({
                body: ''
            })
            toast.success(response.data.message)
        } catch (error) {
            setSubmitting(false)
            if(error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }

    const deleteAnswer = async (answer) => {
        if(confirm('are you sure you want to delete this answer ?')) {
            try {
                const response = await axios.delete(`${BASE_URL}/delete/${question.slug}/${answer}/answer`,
                    getConfig(token))
                    if(response.data.error) {
                        toast.error(response.data.error)
                    }else {
                        setQuestion(response.data.data)
                        toast.success(response.data.message)
                    }
            } catch (error) {
                console.log(error)
            }
        }
    }

    if(error) {
        return(
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <div className="alert alert-danger my-3">
                                { error }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if(loading || !question) {
        return (
          <div className="d-flex justify-content-center my-3">
            <Spinner />
          </div>
        )
    }

    return (
        <div className='row my-5'>
            <div className="col-md-10 mx-auto">
                <div className="card">
                    <div className="card-header bg-white">
                        <h4 className="my-4">
                            { question?.title }
                        </h4>
                        <div className="d-flex align-self-end">
                            <img src={question?.user?.image} alt="User Image"  
                                width={30}
                                height={30}
                                className='rounded-circle me-2'
                            />
                            <span className="text-primary me-2">
                                { question?.user?.name }
                            </span>
                            <span className="text-danger me-2">
                                Asked { question?.created_at }
                            </span>
                            <span className="text-dark">
                                { question?.viewCount }
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 d-flex flex-column align-items-center">
                                {
                                    isLoggedIn ? 
                                        <span className="voteUp"
                                            onClick={() => voteQuestion(question.slug, 'voteup')}>
                                            <i className="bi bi-arrow-up-circle h2"></i>
                                        </span>
                                    :
                                        <Link to="/login" className='voteUp text-dark'>
                                            <i className="bi bi-arrow-up-circle h2"></i> 
                                        </Link>
                                }
                                <span className="fw-bold">
                                    { question?.score }
                                </span>
                                {
                                    isLoggedIn ? 
                                        <span className="voteDown"
                                            onClick={() => voteQuestion(question.slug, 'votedown')}>
                                            <i className="bi bi-arrow-down-circle h2"></i>
                                        </span>
                                    :
                                        <Link to="/login" className='voteDown text-dark'>
                                            <i className="bi bi-arrow-down-circle h2"></i> 
                                        </Link>
                                }
                                {
                                    isLoggedIn ? 
                                        <i className={`bi ${exists ? 'bi bi-bookmark-check-fill text-success' : 'bi-bookmark-plus'}`} style={{cursor:'pointer'}}
                                            onClick={() => dispatch(bookmark(question))}
                                            ></i>
                                    :
                                        <Link to="/login" className='mt-2 text-decoration-none text-dark'>
                                            <i className="bi bi-bookmark-plus"></i> 
                                        </Link>
                                }
                            </div>
                            <div className="col-md-7">
                                { Parser().parse(question?.body) }
                            </div>
                        </div>
                    </div>
                    {
                        question?.tags?.length > 0 && <div className="card-footer bg-white">
                            <div className="d-flex flex-wrap">
                                {
                                    question?.tags?.map((tag, index) => (
                                        <span className="badge bg-primary me-1"
                                            key={index} >
                                            { tag }
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
                <div className="card bg-light mt-2">
                    <div className="card-header bg-white">
                        <h5 className="mt-2">
                            <i>{ question?.answerCount }</i>
                        </h5>
                    </div>
                    <div className="card-body">
                        <AnswerContext.Provider value={{
                                question, setQuestion, storeAnswer, answer, setAnswer,
                                errors, submitting, deleteAnswer
                            }}>
                            {
                                isLoggedIn && <AddAnswer />
                            }
                            {
                                question?.answers?.length > 0 && question.answers.map(answer => (
                                    <Answer key={answer.id} answer={answer} />
                                )) 
                            }
                        </AnswerContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    )
}
