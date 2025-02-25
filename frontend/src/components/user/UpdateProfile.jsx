import React, { useEffect, useState } from 'react'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, getConfig } from '../../helpers/config'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../../redux/slices/userSlice'

export default function UpdateProfile() {
    const { isLoggedIn, token, user } = useSelector(state => state.user)
    const[data, setData] = useState({
        name: user?.name,
        email: user?.email
    })
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn) navigate('/login')
    }, [isLoggedIn])

    const updateProfile = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])

        const formData = new FormData()
        if(data.image !== undefined) {
            formData.append('image',data.image)
        }

        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('_method', 'put')

        try {
            const response = await axios.post(`${BASE_URL}/update/profile`,
                formData,getConfig(token,'multipart/form-data'))
            setSubmitting(false)
            dispatch(setCurrentUser(response.data.data))
            toast.success(response.data.message)
            navigate('/profile')
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
                                Update profile
                            </h5>
                        </div>
                        <div className="card-body">
                            <form className="mt-5" onSubmit={(e) => updateProfile(e)}>
                                <div className="mb-3">
                                    <label htmlFor="name">Name*</label>
                                    <input type="text" 
                                        onChange={(e) => setData({
                                            ...data, name: e.target.value
                                        })}
                                        value={data.name}
                                        name='name'
                                        className="form-control" />
                                        { useValidation(errors, 'name') }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email">Email*</label>
                                    <input type="email" 
                                        name='email'
                                        onChange={(e) => setData({
                                            ...data, email: e.target.value
                                        })}
                                        value={data.email}
                                        className="form-control" />
                                        { useValidation(errors, 'email') }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image">Image*</label>
                                    <input type="file" 
                                        name='image'
                                        onChange={(e) => setData({
                                            ...data, image: e.target.files[0]
                                        })}
                                        className="form-control" />
                                        { useValidation(errors, 'image') }
                                        {
                                            data?.image && 
                                                <img src={URL.createObjectURL(data.image)}
                                                    width={150}
                                                    height={150}
                                                    className='rounded my-2'
                                                />
                                        }
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
