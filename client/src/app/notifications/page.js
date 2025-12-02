"use client";
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Bell, CheckCircle, Clock } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            // Optimistically update UI
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        // In a real app, we'd have a bulk endpoint. 
        // For now, let's just mark visible ones individually or refresh.
        // Or simply iterate (not efficient but works for MVP)
        const unread = notifications.filter(n => !n.isRead);
        for (const n of unread) {
            await api.put(`/notifications/${n.id}/read`);
        }
        fetchNotifications();
    };

    if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell size={32} color="var(--primary)" />
                    Notifications
                </h2>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {notifications.length === 0 ? (
                    <div className="card text-center p-8 text-gray-500">
                        <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="card"
                            style={{
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'flex-start',
                                borderLeft: notification.isRead ? 'none' : '4px solid var(--primary)',
                                background: notification.isRead ? 'white' : '#f8fafc'
                            }}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                            <div style={{
                                background: notification.isRead ? '#f1f5f9' : '#e0e7ff',
                                padding: '10px',
                                borderRadius: '50%',
                                color: notification.isRead ? '#94a3b8' : 'var(--primary)'
                            }}>
                                {notification.isRead ? <CheckCircle size={20} /> : <Bell size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    fontWeight: notification.isRead ? 'normal' : 'bold',
                                    marginBottom: '4px',
                                    color: notification.isRead ? 'var(--gray-dark)' : 'var(--dark)'
                                }}>
                                    {notification.title}
                                </h4>
                                <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>
                                    {notification.message}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.8rem',
                                    color: '#999',
                                    marginTop: '8px'
                                }}>
                                    <Clock size={12} />
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {!notification.isRead && (
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    alignSelf: 'center'
                                }} />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
