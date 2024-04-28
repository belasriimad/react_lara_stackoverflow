import React from 'react'

export default function useValidation(errors, field) {
    const renderErrors = (field) => (
        errors?.[field]?.map((error, index) => (
            <div key={index} className="text-white my-2 p-2 bg-danger mx-2">
                { error }
            </div>
        ))
    )

    return renderErrors(field)
}
