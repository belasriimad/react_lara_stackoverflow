import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className='row my-5'>
        <div className="col-md-6 mx-auto">
            <div className="card text-center">
                <div className="card-body">
                    <h3 className="my-3">
                        404 Page Not Found
                    </h3>
                    <Link to="/" className='btn btn-outline-secondary my-2'>
                        Back home
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}
