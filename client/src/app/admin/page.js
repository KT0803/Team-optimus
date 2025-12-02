"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        // Check for admin role
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.role || user.role.toLowerCase() !== 'admin') {
            router.push(user.role ? '/menu' : '/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/admin');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Error loading stats</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '30px', fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Total Revenue</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <TrendingUp size={14} /> +12% from last month
                    </div>
                </div>

                <div className="card glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Total Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>{stats.totalOrders}</h3>
                        </div>
                        <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--danger)' }}>
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                </div>

                <div className="card glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Today's Revenue</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>₹{stats.todayRevenue.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: 'rgba(0, 184, 148, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="card glass" style={{ display: 'none' }}> {/* Hidden for now */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Active Users</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>1,234</h3>
                        </div>
                        <div style={{ background: 'rgba(9, 132, 227, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--info)' }}>
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => router.push('/admin/manage-menu')}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px' }}
                    >
                        <Package size={20} />
                        Manage Menu
                    </button>
                    <button
                        onClick={() => router.push('/admin/all-orders')}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', background: 'white' }}
                    >
                        <ShoppingBag size={20} />
                        View All Orders
                    </button>
                    <button
                        onClick={() => router.push('/admin/feedbacks')}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', background: 'white' }}
                    >
                        <MessageSquare size={20} />
                        View Feedbacks
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Daily Consumption Chart */}
                <div className="card glass">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Daily Consumption (Last 7 Days)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.dailyOrders}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                                    cursor={{ fill: 'rgba(108, 92, 231, 0.05)' }}
                                />
                                <Bar dataKey="orders" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card glass">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Top Selling Items</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {stats.popularItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.5)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'var(--light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    color: 'var(--primary)'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--dark)' }}>{item.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-dark)' }}>{item.category}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '700', color: 'var(--dark)' }}>{item.count} sold</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--success)' }}>₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
