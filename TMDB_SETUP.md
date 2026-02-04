# 🎬 TMDB API Setup Guide

## Getting Your Free TMDB API Key

1. **Visit TMDB**: Go to [https://www.themoviedb.org](https://www.themoviedb.org)

2. **Create Account**: Sign up for a free account

3. **Go to API Settings**: 
   - Click your profile → Settings
   - Click "API" in the left sidebar
   - Click "Create" or "Request an API Key"

4. **Choose "Developer"**: Select the developer option (free)

5. **Fill Application Details**:
   - **Application Name**: "Disney+ Clone Learning Project"
   - **Application URL**: "http://localhost:5173"
   - **Application Summary**: "Personal learning project - Disney+ streaming interface clone"

6. **Get Your Key**: Copy the "API Key (v3 auth)"

7. **Add to Environment**:
   ```bash
   # In backend/.env
   TMDB_API_KEY="your-actual-api-key-here"
   ```

## ✅ What You Get

- **1000+ API calls per day** (free tier)
- **High-quality movie posters** and backdrops
- **Rich metadata**: descriptions, ratings, genres, release dates
- **Disney and Marvel content** well-represented
- **Professional movie database** used by industry

## 🚀 Benefits for Your Project

- **Real movie data** instead of placeholders
- **Professional-quality images** for your portfolio
- **Demonstrates API integration skills** for interviews
- **Fallback system** - works even without API key
- **Caching system** - efficient and fast

## 🛡️ Security Note

- ✅ **Frontend API keys** are safe to expose (TMDB v3)
- ✅ **Rate limiting** built into the service
- ✅ **Fallback data** when API is unavailable
- ✅ **Error handling** for production resilience

Your Disney+ clone will now have real Disney and Marvel movie data with beautiful high-resolution posters! 🎉
