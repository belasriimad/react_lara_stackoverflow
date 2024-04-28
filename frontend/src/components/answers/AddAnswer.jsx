import React, { useContext } from 'react'
import { AnswerContext } from './context/answerContext'
import ReactQuill from 'react-quill'
import { modules } from '../../helpers/config'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'

export default function AddAnswer() {
    const { storeAnswer, answer, setAnswer, errors, submitting } = useContext(AnswerContext)

    return (
        <div className='row my-5'>
            <div className="col-md-10 mx-auto">
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h5 className="text-center mt-2">
                            Add your answer
                        </h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => storeAnswer(e)}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
