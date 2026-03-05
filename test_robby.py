#!/usr/bin/env python3
"""
Test script for Robby voice assistant
Tests command processing without requiring actual voice input
"""

import sys
sys.path.insert(0, '/home/runner/work/Robby/Robby')

from robby import Robby


def test_command_processing():
    """Test that command processing works correctly"""
    print("Testing Robby command processing...")
    
    # Create assistant instance
    assistant = Robby()
    
    # Disable listen() for testing by mocking it
    def mock_listen():
        return None
    
    assistant.listen = mock_listen
    
    # Test commands (excluding those that require follow-up input)
    test_commands = [
        ("help", "should display help"),
        ("find truck stop", "should acknowledge truck stop finder"),
        ("navigate to New York", "should acknowledge navigation"),
        ("fuel prices", "should acknowledge fuel finder"),
        ("unknown command", "should handle unknown commands"),
        ("stop", "should exit gracefully"),
    ]
    
    print("\n" + "="*60)
    print("Testing command processing (without voice input)")
    print("="*60 + "\n")
    
    for command, description in test_commands:
        print(f"Test: {description}")
        print(f"Command: '{command}'")
        
        # Reset running state for each test
        assistant.running = True
        
        # Capture the response
        assistant.process_command(command)
        print("-" * 60 + "\n")
    
    print("✓ All command tests completed!")
    print("\nNote: Actual voice recognition requires a microphone and")
    print("can be tested by running: python robby.py")


if __name__ == "__main__":
    test_command_processing()
