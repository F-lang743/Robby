import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note} from '../types';

const NOTES_STORAGE_KEY = '@voice_notes';

export class NotesService {
  static async saveNote(content: string, transcription: string): Promise<Note> {
    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content,
      transcription,
    };

    const notes = await this.getAllNotes();
    notes.unshift(newNote); // Add to beginning
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return newNote;
  }

  static async getAllNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async deleteNote(id: string): Promise<void> {
    const notes = await this.getAllNotes();
    const filtered = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filtered));
  }

  static async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getAllNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.transcription.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery),
    );
  }
}
