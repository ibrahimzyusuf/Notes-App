import { Container } from 'react-bootstrap'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import NewNote from './components/NewNote'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useMemo } from 'react'
import { v4 as uuidv4 } from "uuid";
import NoteList from './components/NoteList'
import NoteLayout from './components/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'

export type Tag={
  id:string
  label:string
}

export type NoteData={
  title:string
  markdown:string
  tags:Tag[]
}

export type Note={
  id:string
} & NoteData

export type RowNote={
  id:string
} & RowNoteData

export type RowNoteData={
  title:string
  markdown:string
  tagIds:string[]
}

function App() {
  const[notes,setNotes]=useLocalStorage<RowNote[]>('NOTES',[])
  const[tags,setTags]=useLocalStorage<Tag[]>('TAGS',[])

  const notesWithTags=useMemo(()=>{
    return notes.map(note=>{
      return {...note,tags:tags.filter(tag=>note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  const onCreateNote = ({tags,...data}:NoteData) => {
    setNotes(prevNotes=>{
      return [...prevNotes,{...data,id:uuidv4(),tagIds:tags.map(tag=>tag.id)}]
    })
  }

  const onUpdateNote = (id:string,{tags,...data}:NoteData) => {
    setNotes(prevNotes=>{
      return prevNotes.map(note=>{
        if (note.id===id) {
          return {...note, ...data, tagIds:tags.map(tag=>tag.id)}
        } else {
          return note
        }
      })
    })
  }

  const onDeleteNote = (id:string) => {
    setNotes(prevNotes=>{
      return prevNotes.filter(note=>note.id!==id)
    })
  }

  const addTag = (tag:Tag) => {
    setTags(prev=>[...prev,tag])
  }

  const updateTag = (id:string,label:string) => {
    setTags(prevTags=>{
      return prevTags.map(tag=>{
        if (tag.id===id) {
          return {...tag,label}
        } else {
          return tag
        }
      })
    })
  }
  const deleteTag = (id:string) => {
    setTags(prevTags=>{
      return prevTags.filter(tag=>tag.id!==id)
    })
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<NoteList notes={notesWithTags} availableTags={tags} 
        onDeleteTag={deleteTag} onUpdateTag={updateTag} />} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Container>
  )
}

export default App
