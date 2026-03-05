#!/usr/bin/env python3
"""
Demo script showing Robby's command processing capabilities
This script demonstrates the command system without requiring voice input
"""

import sys
sys.path.insert(0, '/home/runner/work/Robby/Robby')

from robby import Robby


def demo_commands():
    """Demonstrate various commands"""
    print("=" * 70)
    print(" Robby Voice Assistant - Command Demo")
    print("=" * 70)
    print("\nThis demo shows how Robby processes different commands.")
    print("In actual use, you would speak these commands instead of typing.\n")
    
    assistant = Robby()
    
    # Mock the listen function to avoid requiring microphone
    def mock_listen():
        return None
    assistant.listen = mock_listen
    
    commands = [
        ("help", "Getting help information"),
        ("find truck stop near me", "Finding truck stops"),
        ("navigate to Chicago", "Requesting navigation"),
        ("show fuel prices", "Checking fuel prices"),
        ("stop", "Exiting the application"),
    ]
    
    for command, description in commands:
        print(f"\n{'-' * 70}")
        print(f"Example: {description}")
        print(f"User says: \"{command}\"")
        print(f"{'-' * 70}")
        assistant.running = True  # Reset for each demo
        assistant.process_command(command)
        input("Press Enter to continue...")
    
    print("\n" + "=" * 70)
    print(" Demo Complete!")
    print("=" * 70)
    print("\nTo try Robby with actual voice input, run: python robby.py")
    print("Make sure you have a microphone connected!")


if __name__ == "__main__":
    demo_commands()
