# Robby - Voice Assistant for Truck Drivers

Robby is a voice-based AI assistant companion designed specifically for truck drivers. It provides hands-free features to make life on the road easier and safer.

## Features

- 🎙️ **Voice-based interface** - Control everything with your voice
- 🗺️ **Navigation assistance** - Find truck stops and get route information (coming soon)
- ⛽ **Fuel price finder** - Locate the cheapest fuel along your route (coming soon)
- 📝 **Voice notes** - Take notes hands-free while driving
- 🔊 **Text-to-speech feedback** - Robby talks back to you

## Installation

### Prerequisites

- Python 3.7 or higher
- Microphone
- Internet connection (for speech recognition)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/F-lang743/Robby.git
cd Robby
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run Robby:
```bash
python robby.py
```

## Usage

Once Robby is running, you can use the following voice commands:

### Available Commands

- **"help"** - Get a list of available commands
- **"find truck stop"** - Find nearby truck stops (coming soon)
- **"navigate to [location]"** - Get navigation assistance (coming soon)
- **"take a note"** - Record a voice note
- **"fuel prices"** - Find cheap fuel locations (coming soon)
- **"stop"** or **"exit"** - Exit the application

### Example Interaction

```
Robby: Hello! I'm Robby, your voice assistant. How can I help you today?
You: help
Robby: I can help you with navigation, notes, and more. Try saying 'find truck stop', 'take a note', or 'stop' to exit.
You: take a note
Robby: What would you like me to note?
You: Remember to call dispatcher at next stop
Robby: Got it. I've noted: Remember to call dispatcher at next stop
```

## Development

### Installing in Development Mode

```bash
pip install -e .
```

### Project Structure

```
Robby/
├── robby.py           # Main application file
├── requirements.txt   # Python dependencies
├── setup.py          # Package setup
└── README.md         # This file
```

## Roadmap

### MVP Features (v0.1.0) - Current
- [x] Basic voice recognition
- [x] Text-to-speech output
- [x] Command processing
- [x] Help system
- [x] Voice notes

### Upcoming Features (v0.2.0)
- [ ] GPS integration
- [ ] Truck stop finder
- [ ] Route navigation
- [ ] Fuel price finder
- [ ] Email sending
- [ ] Note persistence

### Future Enhancements
- [ ] Automatic mileage logging
- [ ] Predictive fuel stops
- [ ] Mobile app (iOS/Android)
- [ ] Integration with trucking platforms

## Requirements

- Python 3.7+
- SpeechRecognition 3.10.0+
- pyttsx3 2.90+
- pyaudio 0.2.13+

## Troubleshooting

### Microphone Issues

If Robby can't hear you:
1. Check that your microphone is connected and working
2. Ensure Python has permission to access your microphone
3. Try adjusting the ambient noise threshold

### Speech Recognition Errors

If Robby can't understand you:
1. Speak clearly and at a moderate pace
2. Reduce background noise
3. Check your internet connection (required for Google Speech Recognition)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Safety Notice

⚠️ **Important**: This app is designed to minimize driver distraction, but always prioritize safety. Pull over when possible for complex interactions. Never let any technology compromise your attention to driving.
