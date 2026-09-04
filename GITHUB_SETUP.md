# GitHub Setup Guide

Connect your Hotel Management System to GitHub for version control and deployment.

## Step 1: Initialize Git Repository

```bash
cd C:\Users\Administrator\Desktop\hotel
git init
```

## Step 2: Configure Git (if first time)

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Hotel Management System"
```

## Step 5: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **+** → **New repository**
3. Fill in:
   - **Repository name**: `hotel`
   - **Description**: `Hotel Task Management and Employee Rating System for Crown Jewel Hotel`
   - **Public/Private**: Choose based on your preference
   - **Don't** initialize with README, .gitignore, or license (we have these)
4. Click **Create repository**

## Step 6: Connect Local to GitHub

Copy the repository URL from GitHub (either HTTPS or SSH):

**HTTPS**: `https://github.com/your-username/hotel.git`
**SSH**: `git@github.com:your-username/hotel.git`

```bash
git remote add origin https://github.com/your-username/hotel.git
```

## Step 7. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Step 8. Verify

1. Go to your GitHub repository page
2. You should see all your files uploaded
3. Check that `.gitignore` is working (no `.env` files should be visible)

## Common Issues

### Issue: "Permission denied (publickey)"
**Solution**: Use HTTPS instead of SSH, or set up SSH keys

### Issue: "Updates were rejected"
**Solution**: Force push (use carefully):
```bash
git push -u origin main --force
```

### Issue: Large files rejected
**Solution**: Check file sizes in `.gitignore` and remove large files

## Next Steps

1. Create branches for features:
```bash
git checkout -b feature/add-ui-components
```

2. Make changes and commit:
```bash
git add .
git commit -m "Add authentication UI"
git push origin feature/add-ui-components
```

3. Create pull requests on GitHub for code review

## GitHub Best Practices

- ✅ Write meaningful commit messages
- ✅ Use branches for features
- ✅ Create pull requests for review
- ✅ Never commit sensitive data (`.env` files)
- ✅ Keep `.gitignore` updated
- ✅ Use issue tracking for bugs/features

---

Your project is now on GitHub! 🎉
