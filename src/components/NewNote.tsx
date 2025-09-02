import React from 'react'
import NoteForm from './NoteForm'
import type { NoteData, Tag } from '../App'

type NewNoteProps={
    onSubmit:(data:NoteData)=>void
    onAddTag:(tag:Tag)=>void
    availableTags:Tag[]
}
const NewNote = ({onSubmit,onAddTag,availableTags}:NewNoteProps) => {
return (
    <div>
        <h1 className='mb-4'>New Note</h1>
        <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
    </div>
)
}

export default NewNote