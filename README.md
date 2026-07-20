<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fc27300b-efbc-4b4a-891e-89bcc7e14fb5

## Run Locally (Web & Android)

**Prerequisites:** Node.js (v18+)

### 1. Run the Web App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key if needed.
3. Run the web app:
   ```bash
   npm run dev
   ```

---

## 📱 Android App Build System (Capacitor)

We have integrated **Capacitor** to turn this web app into a native Android application (.apk and .aab).

### Option 1: Automatic Builds via GitHub Actions (Highly Recommended)
We created a GitHub Actions workflow in `.github/workflows/build-android.yml`.
1. **Push your code to GitHub** (on the `main` branch).
2. Go to the **Actions** tab of your GitHub repository (`Adityamh1/Pashu`).
3. Select the **Build Android APK and AAB** workflow.
4. Once the workflow completes, you can download the following artifacts directly:
   - **PashuBazaar-Debug-APK** (`.apk` - installable directly on Android devices for testing)
   - **PashuBazaar-Debug-AAB** (`.aab` - debug Android App Bundle)
   - **PashuBazaar-Release-AAB-Unsigned** (`.aab` - release Android App Bundle for Google Play Store upload)

### Option 2: Build Locally (Requires Android Studio)
1. Ensure you have **Android Studio** and the **Java Development Kit (JDK 17)** installed on your machine.
2. Build the web app, sync assets, and compile the Android package:
   - **To build APK:**
     ```bash
     npm run android:build-apk
     ```
   - **To build AAB (App Bundle):**
     ```bash
     npm run android:build-aab
     ```
3. Open the project in Android Studio to run it on an emulator or a physical device:
   ```bash
   npx cap open android
   ```
