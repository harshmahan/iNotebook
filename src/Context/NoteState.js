import React from 'react'
import NoteContext from './NoteContext'

const NoteState = (props) => {
    const host = "http://localhost:5000/";
    const notesInitial = []
    const [notes, setNotes] = React.useState(notesInitial);

    // Get all notes
    const getNote = async () => {
        console.log("Adding a new note")
        // API call
        const response = await fetch(`${host}api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('auth-token')
            },
           
        });
        const data = await response.json();
        console.log(data)
        setNotes(data);
    }

    //   Add note   
    const addNote = async (title, description, tag) => {
        console.log("Adding a new note")
        // API call
        const response = await fetch(`${host}api/notes/addnote/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    //  Delete note
    const deleteNote = async (id) => {
        console.log("Deleting note")
        // API call
        const response = await fetch(`${host}api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
           
        });
        const data = await response.json();
        console.log(data)
        
        // Deletion Logic
        const newNote = notes.filter((note) => {return note._id !== id})
        setNotes(newNote)
    }

    // Edit note
    const editNote = async (id, title, description, tag) => {
        
        // API call
        const response = await fetch(`${host}api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        console.log(json)
        let newNotes = JSON.parse(JSON.stringify(notes))
        // Editing Logic
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes)
    }

    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState