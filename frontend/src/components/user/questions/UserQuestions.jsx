import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BASE_URL, getConfig } from '../../../helpers/config'
import axios from 'axios'
import { toast } from 'react-toastify'
import Spinner from '../../layouts/Spinner'

export default function UserQuestions() {
    const{ token } = useSelector(state => state.user)
    const[questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const[questionToShow, setQuestionToShow] = useState(3)

    useEffect(() => {
        const fetchUserQuestions = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${BASE_URL}/user/questions`,
                getConfig(token))
                if(response.data.data.length) {
                    setQuestions(response.data.data)
                }else {
                    setMessage('No questions yet!')
                }
                setLoading(false)
            } catch (error) { 
                setLoading(false)
                console.log(error)
            }
        }
        fetchUserQuestions()
    }, [])

    const loadMoreQuestions = () => {
        if(questionToShow > questions.length) {
            return;
        }else {
            setQuestionToShow(prevQuestionToShow => prevQuestionToShow += 5)
        }
    }

    const deleteQuestion = async (question) => {
        if(confirm('are you sure you want to delete this question ?')) {
            try {
                const response = await axios.delete(`${BASE_URL}/delete/${question}/question`,
                    getConfig(token))
                    if(response.data.error) {
                        toast.error(response.data.error)
                    }else {
                        if(response.data.questions.length) {
                            setQuestions(response.data.questions)
                        }else {
                            setMessage('No questions yet!')
                        }
                        toast.success(response.data.message)
                    }
            } catch (error) {
                console.log(error)
            }
        }
    }

    if(message) {
        return(
            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-info my-3">
                            { message }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='col-md-9'>
            <table className="table table-responsive">
                <caption>List of asked questions</caption>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Published</th>
                        <th></th>
                    </tr>
                </thead>
                {
                    loading ? 
                        <div className="d-flex justify-content-center my-3">
                            <Spinner />
                        </div>
                    :
                    <tbody>
                        {
                            questions.slice(0, questionToShow).map((question, index) => (
                                <tr key={index}>
                                    <td>{index += 1}</td>
                                    <td>
                                        <Link className='text-decoration-none' to={`/question/${question.slug}`}>
                                            {question.title}
                                        </Link>
                                    </td>
                                    <td>{question.created_at}</td>
                                    <td>
                                        <Link className='btn btn-sm btn-warning' to={`/edit/question/${question.slug}`}>
                                            <i className="bi bi-pen"></i>
                                        </Link>
                                        <button className='btn btn-sm btn-danger ms-1' 
                                            onClick={() => deleteQuestion(question.slug)}
                                            >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                }
            </table>
            {
                questionToShow < questions.length && <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-sm btn-secondary"
                        onClick={() => loadMoreQuestions()}>
                            Load more
                        </button>
                </div>
            }
        </div>
    )
}
