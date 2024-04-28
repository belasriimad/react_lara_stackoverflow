import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { BASE_URL, getConfig, modules } from '../../helpers/config'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function EditAnswer() {
    const { isLoggedIn, token, user } = useSelector(state => state.user)
    const[answer, setAnswer] = useState({
        body: ''
    })
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn) navigate('/login')
        const fetchAnswerById = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${BASE_URL}/answers/${id}/show`,
                getConfig(token))
                setAnswer(response.data.data)
                setLoading(false)
            } catch (error) { 
                if(error?.response?.status === 404) {
                    setError('The answer you are looking for does not exist')
                }
                setLoading(false)
                console.log(error)
            }
        }
        fetchAnswerById()
    }, [id, isLoggedIn])

    const updateAnswer = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])
        try {
            const response = await axios.put(`${BASE_URL}/update/${answer.question.slug}/${id}/answer`,answer,
                getConfig(token))
            setSubmitting(false)
            setAnswer({
                body: ''
            })
            toast.success(response.data.message)
            navigate(`/question/${answer.question.slug}`)
        } catch (error) {
            setSubmitting(false)
            if(error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
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

    return (
        <div className='row my-5'>
            <div className="col-md-10 mx-auto">
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h5 className="text-center mt-2">
                            Edit your answer
                        </h5>
                    </div>
                    <div className="card-body">
                        {
                            loading || !answer ? 
                                <div className="d-flex justify-content-center my-3">
                                    <Spinner />
                                </div>
                            :
                            <form className="mt-5" onSubmit={(e) => updateAnswer(e)}>
                                <div className="mb-3">
                                    <label htmlFor="body">Body*</label>
                                    <ReactQuill theme="snow" 
                                        value={answer.body} 
                                        modules={modules}
                                        onChange={(value) => setAnswer({
                                            ...answer, body: value
                                        })} />
                                    { useValidation(errors, 'body') }
                                </div>
                                <div className="mb-3">
                                    {
                                        submitting ?
                                            <Spinner />
                                        :
                                        <button type='submit' className="btn btn-sm btn-dark">
                                            Submit
                                        </button>
                                    }
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
