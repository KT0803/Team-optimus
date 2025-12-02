"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { QrCode, Package, Clock, CheckCircle, AlertCircle, Filter, User, Check } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    const router = useRouter();

    useEffect(() => {
        // Check for admin role
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.role || user.role.toLowerCase() !== 'admin') {
            router.push(user.role ? '/menu' : '/login');
            return;
        }

        fetchOrders();
    }, [router]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Optimistic update or refetch
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            alert(`Order #${orderId} marked as ${newStatus}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'Pending';
        if (filter === 'preparing') return order.status === 'Preparing';
        if (filter === 'ready') return order.status === 'Ready';
        if (filter === 'completed') return order.status === 'Completed';
        return true;
    });

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '100px',
                fontSize: '1.2rem',
                color: 'var(--gray-dark)'
            }}>
                Loading orders...
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Manage Orders
                </h2>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    View and manage all customer orders
                </p>
            </div>

            {/* Filter Buttons */}
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Filter size={16} />
                    All ({orders.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={filter === 'pending' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Clock size={16} />
                    Pending ({orders.filter(o => o.status === 'Pending').length})
                </button>
                <button
                    onClick={() => setFilter('preparing')}
                    className={filter === 'preparing' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Package size={16} />
                    Preparing ({orders.filter(o => o.status === 'Preparing').length})
                </button>
                <button
                    onClick={() => setFilter('ready')}
                    className={filter === 'ready' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <CheckCircle size={16} />
                    Ready ({orders.filter(o => o.status === 'Ready').length})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={filter === 'completed' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <CheckCircle size={16} />
                    Completed ({orders.filter(o => o.status === 'Completed').length})
                </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Package size={64} color="var(--gray)" style={{ margin: '0 auto 20px' }} />
                    <h3 style={{ marginBottom: '10px', color: 'var(--gray-dark)' }}>No orders found</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="card" style={{ position: 'relative', borderLeft: order.status === 'Pending' ? '5px solid var(--warning)' : '5px solid var(--success)' }}>
                            {/* Order Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '20px',
                                paddingBottom: '20px',
                                borderBottom: '2px solid var(--gray)'
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Order #{order.id}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--gray-dark)', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Clock size={16} />
                                            <span style={{ fontSize: '14px' }}>
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <User size={16} />
                                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                {order.user?.name || 'Unknown User'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge ${order.status === 'Completed' ? 'badge-success' :
                                        order.status === 'Pending' ? 'badge-warning' :
                                            'badge-danger'
                                        }`} style={{ fontSize: '13px', padding: '8px 16px', marginBottom: '8px' }}>
                                        {order.status}
                                    </span>
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        ₹{order.totalAmount}
                                    </h3>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{ marginBottom: '20px' }}>
                                <h5 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Items</h5>
                                {order.orderItems.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '10px 0',
                                            borderBottom: '1px solid var(--gray)'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontWeight: '600' }}>{item.menuItem.name}</span>
                                            <span style={{ color: 'var(--gray-dark)', marginLeft: '10px' }}>
                                                × {item.quantity}
                                            </span>
                                        </div>
                                        <span style={{ fontWeight: '600' }}>
                                            ₹{item.menuItem.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'Preparing')}
                                        className="btn btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === 'Preparing' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'Ready')}
                                        className="btn btn-info"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--info)', color: 'white' }}
                                    >
                                        Mark as Ready
                                    </button>
                                )}
                                {order.status === 'Ready' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'Completed')}
                                        className="btn btn-success"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <Check size={18} />
                                        Complete Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
