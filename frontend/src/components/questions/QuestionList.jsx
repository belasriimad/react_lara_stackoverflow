import React, { useContext } from 'react'
import QuestionListItem from './QuestionListItem'
import { QuestionContext } from './context/questionContext'

export default function QuestionList() {
    const { questions, fetchNextPrevQuestions} = useContext(QuestionContext)
    
    const renderPaginationLinks = () => (
        <ul className="pagination">
            {
                questions?.meta?.links?.map((link, index) => (
                    <li key={index} className={`page-item ${!link.url ? 'disabled' : ''}`}>
                        <a href="#"
                            onClick={() => fetchNextPrevQuestions(link.url)}
                            className={`page-link ${link.active ? 'active' : ''}`}>
                            { link.label }
                        </a>
                    </li>
                ))
            }
        </ul>
    )

    return (
        <>
            {
                questions?.data?.map(question => (
                    <QuestionListItem question={question} key={question.id} />
                ))
            }
            <div className="mt-4 d-flex justify-content-between">
                {
                    questions?.meta && <div className="text-muted">
                        Showing { questions?.meta?.from } to { questions?.meta?.to } {" "}
                        from { questions?.meta?.total } results.
                    </div>
                }
                <div>
                    { renderPaginationLinks() }
                </div>
            </div>
        </>
    )
}
