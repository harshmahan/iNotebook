import React from 'react'
import Notes from './Notes'
// import NoteContext from '../Context/NoteContext'


export const Home = (props) => {
  const {showAlert} = props
  // const context = useContext(NoteContext);
  // const { notes, setNotes } = context;
  return (
    <div className="container my-3">
    
    <Notes showAlert={showAlert}/>
    {/* <div className="container my-3">
      <h2>Your notes</h2>
      {notes.map((note) => {
        return note.title;
      })}
    </div> */}
    </div>
  )
}

export default Home