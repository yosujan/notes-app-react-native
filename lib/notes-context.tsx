import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Note } from './types';

interface NotesContextType {
  notes: Note[];
  sortedNotes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      heading: 'Welcome to Notes!',
      description: 'This is your first note. Tap to view or edit it.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      heading: 'Quick Tips',
      description: 'You can add images to your notes and organize them however you like!',
      createdAt: Date.now() - 1000,
      updatedAt: Date.now() - 1000,
    },
  ]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (
    id: string,
    updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const getNote = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, sortedNotes, addNote, updateNote, deleteNote, getNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
