const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator');
const { route } = require('./auth');
const router = express.Router();


// ROUTE 1: Getting notes of the user using: GET  "/api/notes/fetchallnotes  login required"
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try{
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

// ROUTE 2: Adding a new note using: POST  "/api/notes/addnote  login required"
router.post('/addnote', fetchUser, [
    body('title', 'Title can not be blank').exists(),
    body('description', 'Description should be minimum 5 characters').isLength({ min: 5 })], async (req, res) => {
    const {title, description, tag} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const note = new Notes({ title, description, tag, user: req.user.id });
        const saveNote = await note.save();
        res.json(saveNote);
    }catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// ROUTE 3: Updating a existing note using: PUT  "/api/notes/updatenote/:id  login required"
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const {title, description, tag} = req.body;
    // Create a new note
    try{
    const newNote = {} ;
    if(title) {newNote.title = title};
    if(description) {newNote.description = description};
    if(tag) {newNote.tag = tag};
    
    // Find the node to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({msg: "Note not found"});
    }
    // Allow updation to authorized user 
    if(note.user.toString() !== req.user.id) {
        return res.status(401).json({msg: "User not authorized"});
    }
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({note});
    }catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// ROUTE 4: Deleting a existing note using: DELETE  "/api/notes/deletenote/:id  login required"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    const {title, description, tag} = req.body;
    // Find the node to be deleted
    try{
    let note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({msg: "Note not found"});
    }
    // Allow deletion to authorized user
    if(note.user.toString() !== req.user.id) {
        return res.status(401).json({msg: "User not authorized"});
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been deleted"});
    }catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;