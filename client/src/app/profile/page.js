"use client";
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { User, Mail, Phone, Shield, Edit2, Save, X, DollarSign, ShoppingBag, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState({
        totalSpent: 0,
        totalOrders: 0,
        activeSubscriptions: 0
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfileAndAnalytics();
    }, []);

    const fetchProfileAndAnalytics = async () => {
        try {
            const [profileRes, analyticsRes] = await Promise.all([
                api.get('/profile'),
                api.get('/analytics/student')
            ]);

            setUser(profileRes.data);
            setAnalytics(analyticsRes.data);

            setFormData({
                name: profileRes.data.name,
                phone: profileRes.data.phone,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate password change
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                setMessage({ type: 'error', text: 'Current password is required to change password' });
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match' });
                return;
            }
        }

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const res = await api.put('/profile', updateData);
            setUser(res.data.user);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.data.user }));

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update profile'
            });
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '100px',
                fontSize: '1.2rem',
                color: 'var(--gray-dark)'
            }}>
                Loading profile...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    My Profile
                </h2>
                <p style={{ color: 'var(--gray-dark)' }}>Manage your account information</p>
            </div>

            {message.text && (
                <div style={{
                    padding: '15px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    background: message.type === 'success' ? 'rgba(0, 184, 148, 0.1)' : 'rgba(214, 48, 49, 0.1)',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                }}>
                    {message.text}
                </div>
            )}

            {/* Analytics Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}>
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Spent</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{analytics.totalSpent}</h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}>
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Orders</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.totalOrders}</h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Active Plans</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analytics.activeSubscriptions}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                <div className="card glass">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Weekly Attendance</h3>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.weeklyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                                    cursor={{ fill: 'rgba(108, 92, 231, 0.05)' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card glass">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Monthly Expenses</h3>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.monthlyExpenses}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--gray-dark)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--secondary)' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem' }}>Account Details</h3>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setEditing(false);
                                setFormData({
                                    name: user.name,
                                    phone: user.phone,
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: '',
                                });
                                setMessage({ type: '', text: '' });
                            }}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    )}
                </div>

                {!editing ? (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', marginBottom: '4px' }}>Name</p>
                                <p style={{ fontSize: '18px', fontWeight: '600' }}>{user.name}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Mail size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', marginBottom: '4px' }}>Email</p>
                                <p style={{ fontSize: '18px', fontWeight: '600' }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Phone size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', marginBottom: '4px' }}>Phone</p>
                                <p style={{ fontSize: '18px', fontWeight: '600' }}>{user.phone}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Shield size={24} color="white" />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', marginBottom: '4px' }}>Role</p>
                                <span className="badge badge-success" style={{ fontSize: '14px', padding: '8px 16px' }}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email (cannot be changed)</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                style={{ background: 'var(--gray)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid var(--gray)' }} />

                        <h4 style={{ marginBottom: '20px' }}>Change Password (Optional)</h4>

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
