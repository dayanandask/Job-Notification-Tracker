import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeJobs } from '@/lib/scraper';

export async function POST(req: Request) {
    try {
        const { companyId } = await req.json();

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId }
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        const jobs = await scrapeJobs(company.careerUrl);

        // Save jobs while avoiding duplicates (heuristic based on companyId + title + location)
        let newJobsCount = 0;
        for (const job of jobs) {
            try {
                await prisma.job.upsert({
                    where: {
                        companyId_title_location: {
                            companyId,
                            title: job.title,
                            location: job.location || 'Unknown'
                        }
                    },
                    update: {}, // Don't update if exists
                    create: {
                        companyId,
                        title: job.title,
                        location: job.location,
                        postedDate: job.postedDate
                    }
                });
                newJobsCount++;
            } catch (e) {
                // Skip duplicates
            }
        }

        await prisma.company.update({
            where: { id: companyId },
            data: { lastScraped: new Date() }
        });

        await prisma.scrapingLog.create({
            data: {
                companyId,
                status: 'success',
                message: `Found ${jobs.length} jobs, added ${newJobsCount} entries.`
            }
        });

        return NextResponse.json({ jobs, newJobsCount });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
