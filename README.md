# Rafraîchir son français 🇫🇷

9-week French refresher course with 45 pre-built audio dialogues, multi-character voices, and English translations.

## Deploy to Vercel

```bash
# 1. Unzip and enter the project
cd french-course

# 2. Install dependencies
npm install

# 3. Test locally
npm run dev

# 4. Push to GitHub
git init
git add .
git commit -m "French refresher course"
gh repo create french-refresher --public --push

# 5. Deploy — go to vercel.com/new, import the repo, deploy.
#    Or use the Vercel CLI:
npx vercel
```

## Features
- 45 sessions across 9 themed weeks (including a dedicated wine & food week)
- Auto-playing dialogues with character voices (browser TTS)
- English translation toggle
- Speed control (normal / slow)
- Tap any line to replay
- Tap key phrases to hear pronunciation
- Progress tracking
- Fully offline after first load — no API calls
