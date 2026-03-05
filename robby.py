#!/usr/bin/env python3
"""
Robby - Voice Assistant for Truck Drivers
A hands-free voice-based AI assistant companion for truck drivers
"""

import speech_recognition as sr
import pyttsx3
import sys
from typing import Optional


class Robby:
    """Main voice assistant class"""
    
    def __init__(self):
        """Initialize the voice assistant"""
        self.recognizer = sr.Recognizer()
        self.running = False
        
        # Initialize text-to-speech engine (may not be available in all environments)
        try:
            self.engine = pyttsx3.init()
            # Configure text-to-speech
            self.engine.setProperty('rate', 150)  # Speed of speech
            self.engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)
            self.tts_available = True
        except Exception as e:
            print(f"Warning: Text-to-speech not available: {e}")
            self.engine = None
            self.tts_available = False
        
    def speak(self, text: str):
        """Convert text to speech"""
        print(f"Robby: {text}")
        if self.tts_available and self.engine:
            self.engine.say(text)
            self.engine.runAndWait()
    
    def listen(self) -> Optional[str]:
        """Listen for voice input and convert to text"""
        with sr.Microphone() as source:
            print("Listening...")
            self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                text = self.recognizer.recognize_google(audio)
                print(f"You said: {text}")
                return text.lower()
            except sr.WaitTimeoutError:
                return None
            except sr.UnknownValueError:
                self.speak("Sorry, I didn't catch that. Could you repeat?")
                return None
            except sr.RequestError as e:
                self.speak("Sorry, I'm having trouble with speech recognition.")
                print(f"Error: {e}")
                return None
    
    def process_command(self, command: str):
        """Process voice commands"""
        if not command:
            return
        
        # Help command
        if "help" in command:
            self.speak("I can help you with navigation, notes, and more. "
                      "Try saying 'find truck stop', 'take a note', or 'stop' to exit.")
        
        # Navigation commands
        elif "find" in command and "truck stop" in command:
            self.speak("Finding nearby truck stops. This feature will be implemented soon.")
        
        elif "navigate" in command or "route" in command:
            self.speak("Navigation feature coming soon. I'll help you find the best routes.")
        
        # Note-taking command
        elif "note" in command or "remind" in command:
            self.speak("What would you like me to note?")
            note_content = self.listen()
            if note_content:
                self.speak(f"Got it. I've noted: {note_content}")
                # TODO: Save note to file or database
        
        # Fuel prices
        elif "fuel" in command or "gas" in command:
            self.speak("Fuel price finder coming soon. I'll help you find the cheapest fuel.")
        
        # Stop command
        elif "stop" in command or "exit" in command or "quit" in command:
            self.speak("Goodbye! Drive safe.")
            self.running = False
        
        # Unknown command
        else:
            self.speak("I'm not sure how to help with that. Say 'help' for available commands.")
    
    def run(self):
        """Main loop for the voice assistant"""
        self.running = True
        self.speak("Hello! I'm Robby, your voice assistant. How can I help you today? Say 'help' for commands.")
        
        while self.running:
            command = self.listen()
            if command:
                self.process_command(command)


def main():
    """Main entry point"""
    try:
        assistant = Robby()
        assistant.run()
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
