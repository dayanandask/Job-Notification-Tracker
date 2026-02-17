# 🏢 Job Notification Tracker - v2.0
**Part of the KodeNest B2B CareerTech Platform**

An industrial-grade company hiring intelligence system designed to scrape, track, and alert placement cells about new job openings on corporate career pages.

---

## 🚀 Key Features
- **Company Tracker**: Monitor career page URLs with automatic job detection.
- **Smart Scraper**: Heuristic-based scraping for job titles, locations, and dates.
- **Change Detection**: Compares latest scrapes with historical data to find new opportunities.
- **Analytics Dashboard**: Distribution charts and hiring funnel visualization.
- **Sync Engine**: Real-time synchronization with external career portals.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Strict B2B Design)
- **ORM**: Prisma (SQLite)
- **Utils**: Cheerio (Scraping), Axios, Lucide-React, Recharts

## 🎨 Design Standards (Strict B2B)
- **Background**: `#F7F6F3` (Off-White)
- **Accent**: `#8B0000` (Deep Red)
- **Typography**: Playfair Display (Headings), Inter (Body)
- **Spacing**: 8/16/24/40/64px scale only.

## ⚙️ Installation & Setup
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Database Push**:
   ```bash
   npx prisma db push
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
4. **Logic Verification**:
   ```bash
   node test-logic.js
   ```

## 🔨 Testing & Verification
Refer to `BREAK_TESTING.md` for the full functional verification checklist. 
Run `node verify-ui.js` to check for UI design compliance.
