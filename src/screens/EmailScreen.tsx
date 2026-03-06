import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useVoice} from '../contexts/VoiceContext';
import VoiceButton from '../components/VoiceButton';
import Button from '../components/Button';

const EmailScreen: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [currentField, setCurrentField] = useState<'to' | 'subject' | 'body' | null>(null);
  const {speak} = useVoice();

  const handleVoiceInput = (transcription: string) => {
    const lowerTranscription = transcription.toLowerCase();

    // Parse voice commands
    if (lowerTranscription.includes('send to') || lowerTranscription.includes('email to')) {
      const emailMatch = transcription.match(/(?:send|email)\s+to\s+([^\s]+@[^\s]+)/i);
      if (emailMatch) {
        setTo(emailMatch[1]);
        setCurrentField(null);
        speak(`Email will be sent to ${emailMatch[1]}`);
      } else {
        setCurrentField('to');
        speak('Please say the email address');
      }
    } else if (lowerTranscription.includes('subject')) {
      const subjectMatch = transcription.match(/subject\s+(.+)/i);
      if (subjectMatch) {
        setSubject(subjectMatch[1]);
        setCurrentField(null);
        speak('Subject set');
      } else {
        setCurrentField('subject');
        speak('Please say the subject');
      }
    } else if (lowerTranscription.includes('message') || lowerTranscription.includes('body')) {
      const messageMatch = transcription.match(/(?:message|body)\s+(.+)/i);
      if (messageMatch) {
        setBody(messageMatch[1]);
        setCurrentField(null);
        speak('Message set');
      } else {
        setCurrentField('body');
        speak('Please say your message');
      }
    } else if (currentField) {
      // Fill the current field
      switch (currentField) {
        case 'to':
          setTo(transcription);
          speak('Email address set');
          break;
        case 'subject':
          setSubject(transcription);
          speak('Subject set');
          break;
        case 'body':
          setBody(transcription);
          speak('Message set');
          break;
      }
      setCurrentField(null);
    } else {
      speak('Say "send to" followed by email, "subject" followed by subject, or "message" followed by your message');
    }
  };

  const sendEmail = async () => {
    if (!to || !subject || !body) {
      Alert.alert('Error', 'Please fill in all fields');
      speak('Please fill in recipient, subject, and message');
      return;
    }

    // In a real app, this would integrate with an email service
    // For MVP, we'll just simulate sending
    Alert.alert(
      'Email Sent',
      `Email would be sent to: ${to}\n\nSubject: ${subject}\n\nMessage: ${body}`,
      [
        {
          text: 'OK',
          onPress: () => {
            speak('Email sent successfully');
            clearFields();
          },
        },
      ],
    );
  };

  const clearFields = () => {
    setTo('');
    setSubject('');
    setBody('');
    setCurrentField(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Email</Text>
        <Text style={styles.subtitle}>
          Compose and send emails hands-free
        </Text>
      </View>

      <VoiceButton
        onResult={handleVoiceInput}
        prompt={
          currentField
            ? `Please say the ${currentField}`
            : 'What would you like to say? For example: send to john@example.com, subject delivery update, message arrived on time'
        }
      />

      {currentField && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Currently recording: {currentField.toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Email Composer</Text>

        <Text style={styles.label}>To: *</Text>
        <TextInput
          style={styles.input}
          value={to}
          onChangeText={setTo}
          placeholder="recipient@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          title="Record Recipient"
          onPress={() => {
            setCurrentField('to');
            speak('Please say the email address');
          }}
          variant="secondary"
          style={styles.fieldButton}
        />

        <Text style={styles.label}>Subject: *</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Email subject"
        />
        <Button
          title="Record Subject"
          onPress={() => {
            setCurrentField('subject');
            speak('Please say the subject');
          }}
          variant="secondary"
          style={styles.fieldButton}
        />

        <Text style={styles.label}>Message: *</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={body}
          onChangeText={setBody}
          placeholder="Your message"
          multiline
          numberOfLines={6}
        />
        <Button
          title="Record Message"
          onPress={() => {
            setCurrentField('body');
            speak('Please say your message');
          }}
          variant="secondary"
          style={styles.fieldButton}
        />

        <View style={styles.actionButtons}>
          <Button
            title="Send Email"
            onPress={sendEmail}
            style={styles.sendButton}
          />
          <Button
            title="Clear"
            onPress={clearFields}
            variant="secondary"
            style={styles.clearButton}
          />
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Voice Email Commands</Text>
        <Text style={styles.instructionsText}>
          • Say "send to" followed by email address{'\n'}
          • Say "subject" followed by your subject{'\n'}
          • Say "message" followed by your message{'\n'}
          • Or use the "Record" buttons for each field{'\n'}
          {'\n'}
          <Text style={styles.example}>
            Example: "Send to boss@company.com subject delivery update message
            all packages delivered on time"
          </Text>
          {'\n\n'}
          <Text style={styles.note}>
            Note: In production, this would integrate with email services
            like SendGrid, Gmail API, or similar for actual email delivery.
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
  promptContainer: {
    backgroundColor: '#3498DB',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  fieldButton: {
    marginBottom: 15,
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  sendButton: {
    flex: 2,
  },
  clearButton: {
    flex: 1,
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
  example: {
    fontStyle: 'italic',
    color: '#3498DB',
  },
  note: {
    fontStyle: 'italic',
    color: '#95A5A6',
  },
});

export default EmailScreen;
