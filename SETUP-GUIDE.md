# Daily Words — Setup Guide (do this on your phone or PC)

You are setting up 4 files in your GitHub repo. Once they are in,
the app runs itself every day. No coding needed after this.

**Your repo:** github.com/anthonyventer4-droid/-nkwaneasv1-cmd-nkwane

---

## Step 0 — Rename the repo (recommended, 1 minute)

The leading dash in `-nkwaneasv1-cmd-nkwane` causes problems with
some tools and looks broken in URLs.

1. Open the repo → **Settings** (gear icon)
2. Under "Repository name", change it to: `dailywords`
3. Tap **Rename**

GitHub redirects the old name automatically, so nothing breaks.

---

## Step 1 — Delete the old workflow file

Your repo has `.github/workflows/main.yml` from a template. It does
nothing useful and will clutter your Actions tab.

1. Open the repo → tap `.github/workflows` → tap `main.yml`
2. Tap the **⋯ menu** (top right of the file view) → **Delete file**
3. Scroll down → **Commit changes**

---

## Step 2 — Add the 4 files

For each file below: repo home → **Add file → Create new file**,
type the **exact path** as the filename (GitHub creates folders
automatically when you type `/`), paste the content, **Commit**.

| # | Type this as the filename | Copy content from |
|---|---|---|
| 1 | `dailywords/words.json` | words.json in the zip |
| 2 | `dailywords/index.html` | index.html in the zip |
| 3 | `scripts/update-daily-word.mjs` | update-daily-word.mjs in the zip |
| 4 | `.github/workflows/daily-words.yml` | daily-words.yml in the zip |

**On a PC it is faster:** repo home → **Add file → Upload files** →
drag the whole folder structure in → Commit. (Mobile browsers can't
upload folders, which is why the create-and-paste method exists.)

---

## Step 3 — Run the automation once, by hand

This proves everything works without waiting for midnight.

1. Repo → **Actions** tab
2. If GitHub asks you to enable workflows, tap **"I understand… enable them"**
3. Tap **Daily Words** in the left list
4. Tap **Run workflow → Run workflow** (green button)
5. Wait ~20 seconds, refresh. You want a **green tick** ✅

When it finishes, the repo will contain two new files the robot
wrote itself: `dailywords/today.json` and `dailywords/history.json`.
That is your proof of life.

---

## Step 4 — Connect Netlify

1. Log into **app.netlify.com**
2. **Add new site → Import an existing project → GitHub**
3. Authorize, then pick your `dailywords` repo
4. Leave build settings **empty** (no build command, publish
   directory: just `/` — it's plain HTML)
5. Deploy

Your app will live at: `<your-site-name>.netlify.app/dailywords/`

**About dailywordv5.netlify.app:** that existing site is connected
to a different repo (your old Daily Word v5 devotional app). Leave
it alone — this is a new site. If you want a cleaner name, in
Netlify: Site settings → Change site name → e.g. `nkwane-dailywords`.

---

## How it runs from now on

| When (SAST) | What happens |
|---|---|
| 02:05 daily | GitHub Action picks the new word, commits the snapshot |
| ~02:06 | Netlify sees the commit and redeploys automatically |
| All day | Everyone sees the same word; it rolls over itself at 02:00 SAST (midnight UTC) |

**If a day ever looks wrong:** open the repo → Actions tab. Red ❌
means the publish failed — open the run to see why. The page still
works even then, because it can compute the word by itself in the
browser as a fallback.
