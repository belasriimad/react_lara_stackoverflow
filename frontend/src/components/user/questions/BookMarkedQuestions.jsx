import React, { useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { bookmark } from '../../../redux/slices/bookmarkSlice'

export default function BookMarkedQuestions() {
    const{ isLoggedIn } = useSelector(state => state.user)
    const{ bookmarked } = useSelector(state => state.bookmark)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(!isLoggedIn) navigate('/login')
    }, [])

    if(!bookmarked.length) {
        return(
            <div className="row my-5">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <div className="alert alert-info my-3">
                                No questions found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row my-5">
            <div className="col-md-10 mx-auto">
                <table className="table table-responsive">
                    <caption>List of saved questions</caption>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Published</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookmarked.map((question, index) => (
                                <tr key={index}>
                                    <td>{index += 1}</td>
                                    <td>
                                        <Link className='text-decoration-none' to={`/question/${question.slug}`}>
                                            {question.title}
                                        </Link>
                                    </td>
                                    <td>{question.created_at}</td>
                                    <td>
                                        <button className='btn btn-sm btn-danger ms-1' 
                                            onClick={() => dispatch(bookmark(question))}
                                            >
                                            <i className="bi bi-bookmark-dash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
