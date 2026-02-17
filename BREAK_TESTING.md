# 🔨 BREAK TESTING & VERIFICATION GUIDE

## 🔎 Functional Verification Checklist
1. **Add Company**: Use an invalid URL (e.g., `not-a-url`). The system should handle this gracefully.
2. **Duplicate Prevention**: Try adding the same company URL twice. The system should block the second entry.
3. **Internal Sync**: Click "Sync" on a company. Check browser network tab for `/api/scrape` call.
4. **Data Integrity**: Delete `prisma/dev.db` and run `npx prisma db push` to verify system recovery.
5. **Scale Test**: Add 5+ companies simultaneously.

## 🎨 UI Design Compliance
- **Background**: Ensure `#F7F6F3` is used (run `node verify-ui.js`).
- **No White**: Search codebase for `#FFFFFF` or `bg-white` (ensure it's only used for card backgrounds if intended).
- **Fonts**: Check that headings use Serif (Playfair Display).
- **Spacing**: Verify margins/padding only use `8/16/24/40/64` pixels.

## 🚀 Break Tests (Try to break it!)
- **SQL Injection**: Try entering `' OR 1=1 --` into the Company Name field. (Prisma handles this via parameterized queries).
- **Malformed URL**: Enter `http://example.com/%%%path`.
- **Network Failure**: Disable internet and try to "Sync". Check if the UI logs a failure or spins forever.
- **Extreme Payload**: Attempt to paste a 1MB string into the company name field.
