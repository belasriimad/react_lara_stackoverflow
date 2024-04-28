import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import UserQuestions from './questions/UserQuestions'
import Sidebar from './partials/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const { isLoggedIn } = useSelector(state => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn) navigate('/login')
    }, [isLoggedIn])

    return (
        <div className='container'>
            <div className="row my-5">
                <Sidebar />
                <UserQuestions />
            </div>
        </div>
    )
}
