# AI_MCQ

Requirements
• Node.js (v18+)
• Ollama installed (see installation steps below)
• LLaMA3 model

Ollama Installation

macOS

```
brew install ollama
```

Windows

1. Download from https://ollama.com/download
2. Run the installer
3. Restart terminal

Linux

```
curl -fsSL https://ollama.com/install.sh | sh
```

Verify installation

```
ollama --version
```

    LLaMA3 Setup

    command

    ollama pull llama3
    ollama serve

    Backend Setup

cd backend
npm install
node index.js
