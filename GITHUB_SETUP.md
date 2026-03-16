# GitHub Setup Guide

## Quick Start: Push to GitHub

This guide will help you push the ML & AI Visualizer code to GitHub.

## Option 1: Using v0 Settings (Easiest)

1. Click the **Settings icon (⚙️)** in the top right corner of v0
2. Navigate to the **Settings** tab
3. Find the **Git Repository** section
4. Click **Connect Repository**
5. Select **Create a new repository** or choose an existing one
6. Authorize GitHub access when prompted
7. v0 will automatically push all changes to your repository

## Option 2: Manual Setup from Your Local Machine

### Prerequisites
- Git installed on your computer
- GitHub account
- Terminal/Command prompt access

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `ml-ai-visualizer` (or your preferred name)
3. **Description**: "Interactive ML & AI Visualizer - Learn neural networks, algorithms, transformers, and RAG systems"
4. **Privacy**: Choose Public or Private
5. Click **Create repository**
6. Copy the HTTPS or SSH URL (you'll need it soon)

### Step 2: Initialize and Push Local Code

```bash
# Navigate to your project directory
cd path/to/ml-ai-visualizer

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete ML & AI Visualizer with neural networks, algorithms, transformers, and RAG systems"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ml-ai-visualizer.git

# Push to GitHub (use 'main' or 'master' depending on your default branch)
git branch -M main
git push -u origin main
```

### Step 3: Verify Push Success

- Go to your GitHub repository URL
- You should see all files and folders from the project
- Verify the following key directories exist:
  - `/app` - All pages and modules
  - `/components` - Reusable components
  - `/lib` - Utility functions
  - `/public` - Static assets
  - Documentation files (README.md, etc.)

## File Structure Overview

The repository will contain:

```
ml-ai-visualizer/
├── app/
│   ├── neural-networks/page.tsx
│   ├── ml-algorithms/page.tsx
│   ├── algorithms/page.tsx
│   ├── transformers/page.tsx
│   ├── rag/page.tsx
│   ├── playground/page.tsx
│   ├── docs/page.tsx
│   ├── glossary/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── navigation.tsx
│   ├── neural-network-canvas.tsx
│   ├── ml-canvas.tsx
│   ├── transformer-canvas.tsx
│   ├── rag-canvas.tsx
│   └── glossary.tsx
├── lib/
│   ├── neural-network.ts
│   ├── ml-algorithms.ts
│   ├── transformers.ts
│   └── rag.ts
├── public/
│   └── (static assets)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── README.md
├── QUICKSTART.md
├── FEATURES.md
└── [other documentation files]
```

## Recommended .gitignore Entries

These are typically already configured, but verify they're in your `.gitignore`:

```
node_modules/
.next/
out/
.env
.env.local
.DS_Store
*.log
```

## Next Steps

### Deploy to Vercel (Optional but Recommended)

Once on GitHub, you can deploy easily:

1. Go to https://vercel.com
2. Click **New Project**
3. Select **Import Git Repository**
4. Choose your GitHub repository
5. Click **Deploy**
6. Your app will be live in seconds!

### Collaboration

If you're working with a team:

1. Create feature branches: `git checkout -b feature/new-feature`
2. Push to your branch: `git push origin feature/new-feature`
3. Create Pull Requests for code review
4. Merge to main when approved

## Troubleshooting

### Push Rejected
**Error**: "fatal: The remote origin already exists"
**Solution**: 
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ml-ai-visualizer.git
git push -u origin main
```

### Authentication Issues
**For HTTPS**: Use personal access token instead of password
- Go to https://github.com/settings/tokens
- Create new token with 'repo' scope
- Use token as password

**For SSH**: Set up SSH keys
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add public key to https://github.com/settings/keys
```

### Large Files
If you encounter size limits, use Git LFS:
```bash
git lfs install
git lfs track "*.png" "*.jpg"
git add .gitattributes
```

## Getting Help

- **v0 Support**: Open the support menu in v0 (top right) for help with the v0 interface
- **GitHub Help**: https://docs.github.com
- **Vercel Deployment**: https://vercel.com/docs

## Version Control Best Practices

1. **Commit frequently** with clear messages
2. **Use branches** for new features
3. **Write good commit messages**: 
   - ✅ "Add RAG visualization with document retrieval"
   - ❌ "fix stuff"
4. **Pull before push** to avoid conflicts
5. **Keep README updated** as you make changes

## Project Metadata

For your GitHub repository, you may want to add:

**Topics**: `machine-learning`, `neural-networks`, `transformers`, `rag`, `visualization`, `education`, `interactive`

**Readme Badge** (optional):
```markdown
# ML & AI Visualizer

[![Deployed with v0](https://img.shields.io/badge/deployed%20with-v0-blueviolet)](https://v0.app)
[![Made with Next.js](https://img.shields.io/badge/made%20with-Next.js-black?logo=next.js)](https://nextjs.org)
```

---

Choose the option that works best for you! The v0 Settings option is easiest, while manual setup gives you more control over your repository configuration.
