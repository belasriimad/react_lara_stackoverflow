import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    bookmarked: []
}

export const bookmarkSlice = createSlice({
    name: 'bookmarked',
    initialState,
    reducers: {
        bookmark(state, action) {
            const question = action.payload
            const exists = state.bookmarked.find(item => item.id === question.id)
            if(exists) {
                state.bookmarked = state.bookmarked.filter(item => item.id !== question.id)
            }else {
                state.bookmarked = [question, ...state.bookmarked]
            }
        }
    }
})

const bookmarkReducer = bookmarkSlice.reducer

export const { bookmark } = bookmarkSlice.actions

export default bookmarkReducer