import { type FormEvent, useRef } from 'react';
import { type Note } from '../../types';
import noteService from '../services/notes';

interface NoteFormProps {
	notesList: Note[];
	setError: (error: string | null) => void;
	setNotesList: (notesList: Note[]) => void;
}

const NoteForm = ({ setError, notesList, setNotesList }: NoteFormProps) => {
	const noteRef = useRef<HTMLInputElement>(null);
	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!noteRef.current?.value.trim()) {
			setError('Note content cannot be empty');
			setTimeout(() => setError(null), 5000);
			return;
		}

		try {
			const newObject = {
				content: noteRef.current.value,
				important: Math.random() < 0.5,
			};

			const createNote = await noteService.create(newObject);
			setNotesList([...notesList, createNote]);

			if (noteRef.current) {
				noteRef.current.value = '';
			}
		} catch (error) {
			console.error(error);
			setError('Failed to create new note');
			setTimeout(() => setError(null), 5000);
		}
	};

	return (
		<form onSubmit={handleFormSubmit}>
			<input ref={noteRef} type='text' name='addQuote' />
			<button type='submit'>Save</button>
		</form>
	);
};

export default NoteForm;
