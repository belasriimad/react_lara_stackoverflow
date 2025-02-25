import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    const { user } = useSelector(state => state.user)

    return (
        <div className='col-md-3'>
            <div className="card p-2">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <img src={user?.image} alt="User Image" 
                        width={100}
                        height={100}
                        className='rounded-circle'
                    />
                    <span className="fw-bold my-2">
                        <i className="bi bi-person-check"></i> {user?.name}
                    </span>
                    <Link className='btn btn-sm btn-link text-decoration-none text-dark' to="/bookmarked/questions">
                        <i className="bi bi-bookmark"></i> saved questions
                    </Link>
                    <Link className='btn btn-sm btn-link' to="/update/password">
                        <i className="bi bi-pen"></i> update your password
                    </Link>
                    <Link className='btn btn-sm btn-link' to="/update/profile">
                        <i className="bi bi-pen"></i> update your profile
                    </Link>
                </div>
            </div>
        </div>
    )
}
