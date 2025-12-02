"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { ShoppingBag, User, Calendar, DollarSign, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.role || user.role.toLowerCase() !== 'admin') {
            router.push('/login');
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            alert('Order status updated successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to update order status');
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: 'rgba(0, 184, 148, 0.1)', color: 'var(--success)' };
            case 'Pending': return { bg: 'rgba(255, 177, 66, 0.1)', color: '#FFB142' };
            case 'Preparing': return { bg: 'rgba(9, 132, 227, 0.1)', color: 'var(--info)' };
            case 'Cancelled': return { bg: 'rgba(255, 107, 107, 0.1)', color: 'var(--danger)' };
            default: return { bg: 'rgba(0, 0, 0, 0.05)', color: 'var(--gray-dark)' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} />;
            case 'Pending': return <Clock size={16} />;
            case 'Preparing': return <Clock size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px' }}>All Orders</h1>
                    <p style={{ color: 'var(--gray-dark)' }}>Manage and track all customer orders</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Filter size={20} color="var(--gray-dark)" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input"
                        style={{ minWidth: '150px' }}
                    >
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Orders</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>{orders.length}</h3>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Pending</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#FFB142' }}>
                        {orders.filter(o => o.status === 'Pending').length}
                    </h3>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Completed</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--success)' }}>
                        {orders.filter(o => o.status === 'Completed').length}
                    </h3>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Revenue</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                        ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredOrders.map(order => {
                    const statusStyle = getStatusColor(order.status);
                    return (
                        <div key={order.id} className="card glass" style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--dark)' }}>
                                            Order #{order.id}
                                        </h3>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: statusStyle.bg,
                                            color: statusStyle.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={16} />
                                            <span>{order.user?.name || 'Unknown'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={16} />
                                            <span>{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <DollarSign size={16} />
                                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                                            className="btn btn-primary"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        >
                                            Start Preparing
                                        </button>
                                    )}
                                    {order.status === 'Preparing' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'Completed')}
                                            className="btn btn-primary"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    {(order.status === 'Pending' || order.status === 'Preparing') && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                                            className="btn btn-outline"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '15px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--dark)' }}>
                                    Order Items
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {order.orderItems?.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'white', borderRadius: '8px' }}>
                                            <div>
                                                <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{item.menuItem?.name || 'Unknown Item'}</span>
                                                <span style={{ color: 'var(--gray-dark)', marginLeft: '10px', fontSize: '0.9rem' }}>
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                                ₹{(item.menuItem?.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredOrders.length === 0 && (
                <div className="card glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <ShoppingBag size={48} color="var(--gray)" style={{ margin: '0 auto 20px' }} />
                    <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>No orders found</p>
                </div>
            )}
        </div>
    );
}
