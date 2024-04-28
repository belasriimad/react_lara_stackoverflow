import React, { useContext } from 'react'
import { Parser } from 'html-to-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AnswerContext } from './context/answerContext'
import { BASE_URL, getConfig } from '../../helpers/config'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Answer({answer}) {
    const { isLoggedIn, token, user } = useSelector(state => state.user)
    const { question, setQuestion, deleteAnswer} = useContext(AnswerContext)

    const voteAnswer = async (answerId, vote) => {
        try {
            const response = await axios.put(`${BASE_URL}/${vote}/${answerId}/answer`,null,
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

    const markAnswerAsBest = async (answer) => {
        try {
            const response = await axios.put(`${BASE_URL}/mark/${answer}/best`,null,
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

    const renderAnswerActions = () => (
        answer.user.id === user?.id && <div className="card-header bg-white d-flex justify-content-end">
            <div className="dropdown ms-auto">
                <i className="bi bi-three-dots-vertical"
                    data-bs-toggle="dropdown">
                </i>
                <ul className="dropdown-menu">
                    <li>
                        <Link className='dropdown-item' to={`/edit/answer/${answer.id}`}>
                            <i className="bi bi-pen mx-2 text-warning"></i>
                            Edit
                        </Link>
                    </li>
                    <li>
                        <span className='dropdown-item' 
                            style={{cursor:'pointer'}}
                            onClick={() => deleteAnswer(answer.id)}
                            >
                            <i className="bi bi-trash mx-2 text-danger"></i>
                            Delete
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )

    return (
        <div className="card my-2">
            {
                renderAnswerActions()
            }
            <div className='card-body p-3'>
                <div className="row">
                    <div className="col-md-3 d-flex flex-column align-items-center">
                        {
                            isLoggedIn ? 
                                <span className="voteUp"
                                    onClick={() => voteAnswer(answer.id, 'voteup')}>
                                    <i className="bi bi-arrow-up-circle h2"></i>
                                </span>
                            :
                                <Link to="/login" className='voteUp text-dark'>
                                    <i className="bi bi-arrow-up-circle h2"></i> 
                                </Link>
                        }
                        <span className="fw-bold">
                            { answer.score }
                        </span>
                        {
                            answer.best_answer ? <i className="bi bi-check h2 text-success mt-2"></i> : ''
                        }
                        {
                            isLoggedIn ? 
                                <span className="voteDown"
                                    onClick={() => voteAnswer(answer.id, 'votedown')}>
                                    <i className="bi bi-arrow-down-circle h2"></i>
                                </span>
                            :
                                <Link to="/login" className='voteDown text-dark'>
                                    <i className="bi bi-arrow-down-circle h2"></i> 
                                </Link>
                        }
                    </div>
                    <div className="col-md-7">
                        { Parser().parse(answer.body) }
                    </div>
                </div>
            </div>
            <div className="card-footer d-flex justify-content-between bg-white">
                <div className="d-flex">
                    <img src={answer.user.image} alt="User Image"  
                        width={30}
                        height={30}
                        className='rounded-circle me-2'
                    />
                    <span className="text-primary me-2">
                        { answer.user.name }
                    </span>
                    <span className="text-danger me-2">
                        Asked { answer.created_at }
                    </span>
                </div>
                {
                    isLoggedIn && question.user.id === user.id && !answer.best_answer 
                    && <button className="btn btn-sm btn-success"
                        onClick={() => markAnswerAsBest(answer.id)}>
                        Mark as best answer
                    </button>
                }
            </div>
        </div>
    )
}
