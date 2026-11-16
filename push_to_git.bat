@echo off
echo ==============================================
echo Pushing AL-GAMEL updates to GitHub...
echo ==============================================
git add .
git commit -m "feat: add sitemap, robots.txt, canonical, and hreflang for Google SEO"
git push origin main
echo.
echo ==============================================
echo Done! Changes successfully pushed to GitHub.
echo ==============================================
pause
