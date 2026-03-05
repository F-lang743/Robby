import { VoiceNote } from '../models/TruckStop';

/** Supported spoken commands the assistant recognises. */
export type RecognizedVoiceIntent =
  | 'FIND_NEARBY_TRUCK_STOPS'
  | 'FIND_CHEAPEST_FUEL'
  | 'START_MILEAGE_TRACKING'
  | 'STOP_MILEAGE_TRACKING'
  | 'SAVE_VOICE_NOTE'
  | 'SEND_EMAIL_HANDS_FREE'
  | 'NAVIGATE_TO_DESTINATION'
  | 'UNKNOWN_INTENT';

/** Keyword phrases mapped to their corresponding voice intents. */
const VOICE_COMMAND_KEYWORD_MAP: Record<string, RecognizedVoiceIntent> = {
  'find truck stop': 'FIND_NEARBY_TRUCK_STOPS',
  'truck stop nearby': 'FIND_NEARBY_TRUCK_STOPS',
  'find fuel': 'FIND_CHEAPEST_FUEL',
  'cheapest diesel': 'FIND_CHEAPEST_FUEL',
  'cheap fuel': 'FIND_CHEAPEST_FUEL',
  'start tracking': 'START_MILEAGE_TRACKING',
  'start miles': 'START_MILEAGE_TRACKING',
  'stop tracking': 'STOP_MILEAGE_TRACKING',
  'stop miles': 'STOP_MILEAGE_TRACKING',
  'take a note': 'SAVE_VOICE_NOTE',
  'save note': 'SAVE_VOICE_NOTE',
  'send email': 'SEND_EMAIL_HANDS_FREE',
  navigate: 'NAVIGATE_TO_DESTINATION',
  'take me to': 'NAVIGATE_TO_DESTINATION',
};

/**
 * Parses raw speech-to-text output and returns the driver's most likely
 * intended command.
 *
 * @param spokenVoiceCommandText - The raw transcription from the STT engine.
 * @returns The recognised intent, or `UNKNOWN_INTENT` if no match is found.
 */
export function parseVoiceCommandIntoIntent(
  spokenVoiceCommandText: string,
): RecognizedVoiceIntent {
  const normalisedCommandText = spokenVoiceCommandText.toLowerCase().trim();

  for (const [keywordPhrase, mappedIntent] of Object.entries(
    VOICE_COMMAND_KEYWORD_MAP,
  )) {
    if (normalisedCommandText.includes(keywordPhrase)) {
      return mappedIntent;
    }
  }

  return 'UNKNOWN_INTENT';
}

/**
 * Converts raw STT output into a saved voice note, ready for storage.
 *
 * @param transcribedSpeechText    - The text recognised by the STT engine.
 * @param recordedAtTimestampUtc   - ISO-8601 timestamp of when the note was spoken.
 * @param audioFileUri             - Optional URI of the raw audio recording.
 * @returns A new `VoiceNote` record.
 */
export function createVoiceNoteFromTranscription(
  transcribedSpeechText: string,
  recordedAtTimestampUtc: string,
  audioFileUri: string | null = null,
): VoiceNote {
  return {
    noteId: generateUniqueVoiceNoteId(),
    transcribedNoteText: transcribedSpeechText,
    recordedAtTimestampUtc,
    audioFileUri,
  };
}

/**
 * Generates a unique identifier for a new voice note.
 */
function generateUniqueVoiceNoteId(): string {
  return `voice-note-${crypto.randomUUID()}`;
}
