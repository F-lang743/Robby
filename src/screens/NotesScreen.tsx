import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Note} from '../types';
import {NotesService} from '../services/NotesService';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [recordedNote, setRecordedNote] = useState('');
  const {speak} = useVoice();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await NotesService.getAllNotes();
    setNotes(loadedNotes);
  };

  const handleVoiceNote = (transcription: string) => {
    setRecordedNote(transcription);
    speak('Note recorded. Would you like to save it?');
  };

  const saveNote = async () => {
    if (!recordedNote) {
      Alert.alert('Error', 'Please record a note first');
      return;
    }

    try {
      await NotesService.saveNote(recordedNote, recordedNote);
      speak('Note saved successfully');
      setRecordedNote('');
      loadNotes();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error(error);
    }
  };

  const deleteNote = async (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await NotesService.deleteNote(id);
            speak('Note deleted');
            loadNotes();
          },
        },
      ],
    );
  };

  const readNote = (note: Note) => {
    speak(note.transcription);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Notes</Text>
        <Text style={styles.subtitle}>
          Record notes hands-free
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceNote}
        prompt="What would you like to note?"
      />

      {recordedNote && (
        <View style={styles.recordedNoteContainer}>
          <Text style={styles.recordedNoteLabel}>Recorded Note:</Text>
          <Text style={styles.recordedNoteText}>{recordedNote}</Text>
          <View style={styles.recordedNoteButtons}>
            <Button
              title="Save Note"
              onPress={saveNote}
              style={styles.saveButton}
            />
            <Button
              title="Discard"
              onPress={() => setRecordedNote('')}
              variant="secondary"
              style={styles.discardButton}
            />
          </View>
        </View>
      )}

      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>
          Your Notes ({notes.length})
        </Text>
        
        {notes.length === 0 && (
          <Text style={styles.emptyText}>
            No notes yet. Tap the microphone to start recording.
          </Text>
        )}

        {notes.map(note => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteDate}>
                {new Date(note.date).toLocaleString()}
              </Text>
              <View style={styles.noteActions}>
                <Button
                  title="🔊"
                  onPress={() => readNote(note)}
                  variant="secondary"
                  style={styles.actionButton}
                />
                <Button
                  title="🗑️"
                  onPress={() => deleteNote(note.id)}
                  variant="danger"
                  style={styles.actionButton}
                />
              </View>
            </View>
            <Text style={styles.noteContent}>{note.transcription}</Text>
          </View>
        ))}
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Voice Notes Features</Text>
        <Text style={styles.instructionsText}>
          • Record notes completely hands-free{'\n'}
          • Automatic transcription{'\n'}
          • Review notes anytime{'\n'}
          • Listen to notes with text-to-speech{'\n'}
          • Perfect for logging deliveries, reminders, or observations{'\n'}
          {'\n'}
          <Text style={styles.tip}>
            💡 Tip: Speak clearly and pause briefly before and after your note
            for best transcription accuracy.
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 5,
  },
  recordedNoteContainer: {
    backgroundColor: '#FFF9E6',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F39C12',
  },
  recordedNoteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 5,
  },
  recordedNoteText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 15,
  },
  recordedNoteButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
  },
  discardButton: {
    flex: 1,
  },
  notesContainer: {
    padding: 20,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    padding: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: 30,
  },
  noteContent: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  tip: {
    fontStyle: 'italic',
    color: '#3498DB',
  },
});

export default NotesScreen;
