import type { Note } from '../types';
import SingleNote from './components/SingleNote';
import noteService from './services/notes';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import { type User } from '../types';
import { useState, useEffect } from 'react';

const App = () => {
	const [notesList, setNotesList] = useState<Note[]>([]);
	const [showAll, setShowAll] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	console.log(user);

	const toggleImportanceOf = (id: string) => {
		const note = notesList.find((n) => n.id === id);

		if (!note) {
			setError('Note not found');
			setTimeout(() => setError(null), 5000);
			return;
		}

		const changedNote = { ...note, important: !note.important };

		noteService
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotesList(
					notesList.map((note) => (note.id !== id ? note : returnedNote))
				);
			})
			.catch((error) => {
				setError(`Note '${note.content}' was already removed from server`);
				console.error(error);
				setTimeout(() => {
					setError(null);
				}, 5000);
				setNotesList(notesList.filter((n) => n.id !== id));
			});
	};

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const initialNotes = await noteService.getAll();
				setNotesList(initialNotes);
			} catch (error) {
				setError('Failed to fetch notes from server');
				console.error(error);
				setTimeout(() => setError(null), 5000);
			}
		};
		fetchNotes();
	}, []);

	const notesToShow = showAll
		? notesList
		: notesList.filter((note) => note.important);

	return (
		<div>
			<h1>Notes</h1>
			{user && (
				<div>
					<p>{user.username} logged-in</p>
				</div>
			)}
			{error && <Notification error={error} />}
			{user !== null ? (
				<NoteForm
					setError={setError}
					notesList={notesList}
					setNotesList={setNotesList}
				/>
			) : (
				<LoginForm setError={setError} setUser={setUser} />
			)}
			<ul>
				{notesToShow.map((note) => (
					<SingleNote
						toggleImportance={toggleImportanceOf}
						key={note.id}
						note={note}
					/>
				))}
			</ul>
			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? 'important' : 'all'}
				</button>
			</div>
		</div>
	);
};

export default App;
