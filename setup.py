"""Setup script for Robby voice assistant"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="robby-assistant",
    version="0.1.0",
    author="Robby Team",
    description="A voice-based AI assistant companion for truck drivers",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/F-lang743/Robby",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Multimedia :: Sound/Audio :: Speech",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.7",
    install_requires=[
        "SpeechRecognition>=3.10.0",
        "pyttsx3>=2.90",
        "pyaudio>=0.2.13",
    ],
    entry_points={
        "console_scripts": [
            "robby=robby:main",
        ],
    },
)
