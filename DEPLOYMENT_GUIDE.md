# Mini Arcade Deployment Guide

## 🚀 Quick Deployment Summary

**Current Setup**: Firebase Hosting + React (Vite)
**Live URL**: https://adwin-cd095.web.app
**Build Tool**: Vite
**Deployment**: Firebase CLI

---

## 📋 Initial Deployment Steps

### Prerequisites
- Node.js installed
- Firebase CLI installed
- Firebase project created

### Step 1: Install Dependencies
```bash
cd mini-arcade-react
npm install
```

### Step 2: Build the Project
```bash
npm run build
```
This creates a `dist/` folder with production-ready files.

### Step 3: Deploy to Firebase
```bash
firebase deploy
```

### Step 4: Verify Deployment
- Visit: https://adwin-cd095.web.app
- Test all features work correctly

---

## 🔄 Code Update Workflow

### Scenario 1: Small Code Changes
**When**: Updating text, styles, or simple logic

**Steps**:
1. **Make your code changes**
2. **Build the project**:
   ```bash
   npm run build
   ```
3. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```
4. **Test the live site**

**Time**: 2-3 minutes

### Scenario 2: Adding New Features
**When**: New components, pages, or functionality

**Steps**:
1. **Make code changes**
2. **Test locally**:
   ```bash
   npm run dev
   ```
3. **Fix any bugs locally**
4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Deploy**:
   ```bash
   firebase deploy
   ```
6. **Test live site thoroughly**

**Time**: 10-15 minutes

### Scenario 3: Major Updates
**When**: New dependencies, major refactoring, or new monetization features

**Steps**:
1. **Update dependencies** (if needed):
   ```bash
   npm install new-package
   ```
2. **Test extensively locally**:
   ```bash
   npm run dev
   ```
3. **Check build works**:
   ```bash
   npm run build
   ```
4. **Deploy to staging** (optional):
   ```bash
   firebase hosting:channel:deploy staging
   ```
5. **Test staging URL**
6. **Deploy to production**:
   ```bash
   firebase deploy
   ```
7. **Monitor for errors**

**Time**: 30+ minutes

---

## 🛠️ Common Update Scenarios

### Adding New Games
1. **Create game component** in `src/components/games/`
2. **Add to App.jsx** routing
3. **Update Home.jsx** with new game card
4. **Test locally** → Build → Deploy

### Updating Monetization
1. **Update AdSense ID** in `index.html` and `AdBanner.jsx`
2. **Update Stripe keys** in `stripe.js` and `PremiumFeatures.jsx`
3. **Test payment flow locally**
4. **Build → Deploy**

### Changing Styles
1. **Update CSS** in `src/styles/index.css`
2. **Test responsive design**
3. **Build → Deploy**

### Adding Analytics Events
1. **Update analytics.js** with new events
2. **Add tracking to components**
3. **Test events fire correctly**
4. **Build → Deploy**

---

## 📦 Build Process Details

### What `npm run build` Does:
- Compiles React JSX to JavaScript
- Bundles all assets (CSS, JS, images)
- Optimizes for production
- Creates `dist/` folder
- Generates file hashes for caching

### Build Output Structure:
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].css # Optimized CSS
│   └── index-[hash].js  # Optimized JavaScript
```

### Firebase Configuration:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [...],
    "rewrites": [...],
    "headers": [...]
  }
}
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails
**Symptoms**: Error during `npm run build`
**Solutions**:
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
npm run dev
```

### Issue 2: Deploy Fails
**Symptoms**: Error during `firebase deploy`
**Solutions**:
```bash
# Check Firebase login
firebase login

# Check project
firebase use adwin-cd095

# Check build files exist
ls -la dist/
```

### Issue 3: Site Not Updated
**Symptoms**: Deploy succeeds but changes don't appear
**Solutions**:
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R

# Check build timestamp
ls -la dist/

# Force redeploy
firebase deploy --force
```

### Issue 4: 404 Errors
**Symptoms**: Pages not found after navigation
**Solutions**:
- Check `firebase.json` rewrites configuration
- Ensure SPA routing is properly configured
- Verify all routes point to `index.html`

---

## 🚀 Advanced Deployment Options

### Option 1: Preview Deployments
Test changes before going live:
```bash
# Create preview channel
firebase hosting:channel:preview

# Deploy to preview
firebase hosting:channel:deploy preview

# Share preview URL
firebase hosting:channel:open preview
```

### Option 2: Rollback Previous Version
If something goes wrong:
```bash
# View deployment history
firebase hosting:deploy:list

# Rollback to previous version
firebase hosting:rollback
```

### Option 3: Custom Domain
Add custom domain:
```bash
# Add domain
firebase hosting:sites:create

# Configure DNS
# Follow Firebase console instructions
```

---

## 📊 Deployment Checklist

### Before Every Deploy:
- [ ] Code tested locally
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Responsive design works
- [ ] Analytics events fire
- [ ] AdSense/Stripe configs correct

### After Every Deploy:
- [ ] Site loads correctly
- [ ] All games work
- [ ] Premium features work
- [ ] Analytics receiving data
- [ ] No broken links
- [ ] Mobile version works

### Monthly Maintenance:
- [ ] Update dependencies: `npm update`
- [ ] Check analytics performance
- [ ] Review AdSense earnings
- [ ] Monitor Stripe subscriptions
- [ ] Backup important code

---

## 🎯 Quick Reference Commands

### Development:
```bash
npm run dev          # Start local server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Firebase:
```bash
firebase deploy                    # Deploy to production
firebase hosting:channel:deploy preview  # Deploy to preview
firebase hosting:rollback         # Rollback deployment
firebase use adwin-cd095          # Set project
```

### Troubleshooting:
```bash
npm cache clean --force           # Clear npm cache
rm -rf node_modules dist          # Clean build files
npm install                       # Reinstall dependencies
```

---

## 📱 Mobile Deployment Considerations

### Responsive Testing:
- Test on mobile browsers
- Check touch interactions
- Verify ad display on mobile
- Test premium features on mobile

### Performance:
- Monitor load times
- Check Core Web Vitals
- Optimize images if needed
- Test on slow connections

---

## 🔐 Security Considerations

### API Keys:
- Never expose secret keys in frontend
- Use environment variables for sensitive data
- Regularly rotate API keys
- Monitor for unauthorized usage

### Firebase Security:
- Enable security rules if using database
- Monitor Firebase usage
- Set up alerts for suspicious activity

---

## 📞 Support Resources

### Firebase Hosting Help:
- Documentation: https://firebase.google.com/docs/hosting
- Pricing: https://firebase.google.com/pricing
- Console: https://console.firebase.google.com/

### React/Vite Help:
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/

### Common Issues:
- Stack Overflow: Search "firebase hosting react"
- GitHub Issues: Check repository issues
- Firebase Community: https://firebase.google.com/community

---

## 🎉 Success Metrics

### Deployment Success:
- ✅ Site loads without errors
- ✅ All games function correctly
- ✅ Analytics tracking active
- ✅ Monetization features work
- ✅ Mobile version responsive

### Performance Targets:
- Page load: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Mobile performance: > 90 score
- No console errors

---

## 🚨 Emergency Procedures

### If Site Goes Down:
1. **Check Firebase status**: https://status.firebase.google.com/
2. **Rollback deployment**: `firebase hosting:rollback`
3. **Check domain settings** (if using custom domain)
4. **Monitor error logs**

### If Revenue Stops:
1. **Check AdSense status**
2. **Verify Stripe connectivity**
3. **Check analytics for traffic drops**
4. **Review recent code changes**

---

**Your Deployment Status: ✅ READY**
- Firebase project configured
- Build process working
- Monetization integrated
- Analytics tracking active

**Next Deployment**: Just run `npm run build && firebase deploy`
