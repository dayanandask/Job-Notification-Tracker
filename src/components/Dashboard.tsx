"use client";

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    RefreshCcw,
    Bell,
    BarChart3,
    Briefcase,
    ExternalLink,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function Dashboard() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [scrapingId, setScrapingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies');
            const data = await res.json();
            setCompanies(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, careerUrl: url })
            });
            if (res.ok) {
                setName('');
                setUrl('');
                fetchCompanies();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add company');
            }
        } catch (err) {
            alert('Error adding company');
        } finally {
            setIsAdding(false);
        }
    };

    const handleScrape = async (id: string) => {
        setScrapingId(id);
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId: id })
            });
            if (res.ok) {
                fetchCompanies();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setScrapingId(null);
        }
    };

    const totalJobs = companies.reduce((acc, curr) => acc + (curr._count?.jobs || 0), 0);
    const chartData = companies.map(c => ({
        name: c.name,
        jobs: c._count?.jobs || 0
    })).slice(0, 5);

    return (
        <div className="min-h-screen pb-64">
            {/* Header */}
            <header className="bg-background border-b border-muted py-10 px-6">
                <div className="container-custom flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl text-foreground mb-2">Job Intelligence</h1>
                        <p className="text-muted-foreground font-sans">Corporate Career Path Tracking System</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-accent/10 p-2 rounded-full cursor-pointer">
                            <Bell className="text-accent w-6 h-6" />
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <Plus size={18} />
                            Export Report
                        </button>
                    </div>
                </div>
            </header>

            <main className="container-custom mt-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        icon={<Building2 className="text-accent" />}
                        label="Companies Tracked"
                        value={companies.length.toString()}
                    />
                    <StatCard
                        icon={<Briefcase className="text-accent" />}
                        label="Total Opportunities"
                        value={totalJobs.toString()}
                    />
                    <StatCard
                        icon={<BarChart3 className="text-accent" />}
                        label="Avg. Openings/Company"
                        value={companies.length ? (totalJobs / companies.length).toFixed(1) : "0"}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content - List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/50 border border-muted p-10 rounded-sm">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl">Monitored Entities</h2>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Real-time Scraping Engine</div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="animate-spin text-accent w-10 h-10" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {companies.map((company) => (
                                        <div key={company.id} className="border border-muted p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white transition-colors">
                                            <div>
                                                <h3 className="text-xl mb-1">{company.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase size={14} /> {company._count?.jobs} Jobs
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <RefreshCcw size={14} /> Last: {company.lastScraped ? new Date(company.lastScraped).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex gap-4">
                                                <a
                                                    href={company.careerUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 border border-muted hover:border-accent text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                                <button
                                                    onClick={() => handleScrape(company.id)}
                                                    disabled={scrapingId === company.id}
                                                    className="btn-primary disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {scrapingId === company.id ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
                                                    Sync
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {companies.length === 0 && (
                                        <div className="text-center py-20 text-muted-foreground">
                                            No companies being tracked yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Add and Chart */}
                    <div className="space-y-10">
                        {/* Add Company */}
                        <div className="bg-white/50 border border-muted p-10 rounded-sm">
                            <h2 className="text-2xl mb-6">Track New Entity</h2>
                            <form onSubmit={handleAddCompany} className="space-y-6">
                                <div>
                                    <label className="block text-sm uppercase tracking-widest mb-2 font-semibold">Company Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full bg-transparent border border-muted p-4 focus:outline-none focus:border-accent transition-colors font-sans"
                                        placeholder="e.g. Google"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm uppercase tracking-widest mb-2 font-semibold">Career Page URL</label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                        className="w-full bg-transparent border border-muted p-4 focus:outline-none focus:border-accent transition-colors font-sans"
                                        placeholder="https://..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="w-full btn-primary disabled:opacity-50 py-4 font-semibold uppercase tracking-widest"
                                >
                                    {isAdding ? 'Adding...' : 'Initialize Tracking'}
                                </button>
                            </form>
                        </div>

                        {/* Analytics Mini Chart */}
                        <div className="bg-white/50 border border-muted p-10 rounded-sm">
                            <h2 className="text-2xl mb-6">Distribution</h2>
                            <div className="h-64 mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#F7F6F3', border: '1px solid #D6D3CE', fontFamily: 'Inter' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="jobs" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#8B0000' : '#D6D3CE'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white/50 border border-muted p-10 flex items-center gap-6">
            <div className="p-4 bg-background border border-muted rounded-full">
                {React.cloneElement(icon as React.ReactElement, { size: 28 })}
            </div>
            <div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
                <div className="text-4xl text-foreground font-serif">{value}</div>
            </div>
        </div>
    );
}
