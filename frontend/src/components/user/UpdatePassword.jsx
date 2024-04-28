import React, { useEffect, useState } from 'react'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, getConfig } from '../../helpers/config'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../../redux/slices/userSlice'

export default function UpdatePassword() {
    const { isLoggedIn, token } = useSelector(state => state.user)
    const[newPassword, setNewPassword] = useState('')
    const[currentPassword, setCurrentPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn) navigate('/login')
    }, [isLoggedIn])

    const updatePassword = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])

        const data = { currentPassword, newPassword}

        try {
            const response = await axios.put(`${BASE_URL}/update/password`,
                data,getConfig(token))
            setSubmitting(false)
            if(response.data.error) {
                toast.error(response.data.error)
            }else {
                setCurrentPassword('')
                setNewPassword('')
                toast.success(response.data.message)
                navigate('/profile')
            }
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
                                Update password
                            </h5>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => updatePassword(e)}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword">Current Password*</label>
                                    <input type="password" 
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        value={currentPassword}
                                        name='currentPassword'
                                        className="form-control" />
                                        { useValidation(errors, 'currentPassword') }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword">New Password*</label>
                                    <input type="password" 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        name='newPassword'
                                        className="form-control" />
                                        { useValidation(errors, 'newPassword') }
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
