import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Spinner from '../layouts/Spinner'
import useValidation from '../custom/useValidation'
import { BASE_URL } from '../../helpers/config'
import { toast } from 'react-toastify'
import { setCurrentUser, setLoggedInOut, setToken } from '../../redux/slices/userSlice'

export default function Login() {
    const { isLoggedIn } = useSelector(state => state.user)
    const[user, setUser] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(isLoggedIn) navigate('/')
    }, [isLoggedIn])

    const loginUser = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])

        try {
            const response = await axios.post(`${BASE_URL}/user/login`,
                user)
            dispatch(setLoggedInOut(true))
            dispatch(setCurrentUser(response.data.data))
            dispatch(setToken(response.data.access_token))
            setSubmitting(false)
            toast.success(response.data.message)
            navigate('/')
        } catch (error) {
            setSubmitting(false)
            if(error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }

    return (
        <div className='container'>
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="text-center mt-2">
                                Login
                            </h5>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => loginUser(e)}>
                                <div className="mb-3">
                                    <label htmlFor="email">Email*</label>
                                    <input type="email" 
                                        name='email'
                                        onChange={(e) => setUser({
                                            ...user, email: e.target.value
                                        })}
                                        value={user.email}
                                        className="form-control" />
                                        { useValidation(errors, 'email') }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Password*</label>
                                    <input type="password" 
                                        name='password'
                                        onChange={(e) => setUser({
                                            ...user, password: e.target.value
                                        })}
                                        value={user.password}
                                        className="form-control" />
                                        { useValidation(errors, 'password') }
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
