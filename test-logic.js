const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    console.log("--- 🕵️ LOGIC VERIFICATION ---");

    try {
        // 1. Clean up (Optional for testing)
        await prisma.job.deleteMany({});
        await prisma.company.deleteMany({});

        // 2. Test Add Company
        console.log("1. Testing: Add Company...");
        const google = await prisma.company.create({
            data: {
                name: "Google",
                careerUrl: "https://www.google.com/careers"
            }
        });
        console.log("✅ Company created:", google.name);

        // 3. Test Duplicate Prevention (Simulate API check)
        console.log("2. Testing: Duplicate Prevention...");
        try {
            await prisma.company.create({
                data: {
                    name: "Google Duplicate",
                    careerUrl: "https://www.google.com/careers"
                }
            });
            console.log("❌ FAILED: Allowed duplicate URL");
        } catch (e) {
            console.log("✅ PASSED: Blocked duplicate URL");
        }

        // 4. Test Job Insertion
        console.log("3. Testing: Job Scrape Storage...");
        const job = await prisma.job.create({
            data: {
                companyId: google.id,
                title: "Software Engineer",
                location: "Mountain View",
                postedDate: "Today"
            }
        });
        console.log("✅ Job stored:", job.title);

        // 5. Check Counts
        const counts = await prisma.company.findUnique({
            where: { id: google.id },
            include: { _count: { select: { jobs: true } } }
        });
        console.log("4. Testing: Dashboard Statistics...");
        if (counts._count.jobs === 1) {
            console.log("✅ PASSED: Job counts matching");
        } else {
            console.log("❌ FAILED: Job counts mismatch");
        }

    } catch (err) {
        console.error("❌ ERROR DURING VERIFICATION:", err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
