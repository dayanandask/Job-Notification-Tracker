import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const companies = await prisma.company.findMany({
        include: {
            _count: {
                select: { jobs: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(companies);
}

export async function POST(req: Request) {
    try {
        const { name, careerUrl } = await req.json();

        if (!name || !careerUrl) {
            return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
        }

        const company = await prisma.company.create({
            data: {
                name,
                careerUrl,
            }
        });

        return NextResponse.json(company);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'URL already tracked' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
