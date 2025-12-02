"use client";
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { QrCode, Package, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'Pending';
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
                Loading your orders...
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
                    My Orders
                </h2>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    Track and manage your food orders
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
                    All Orders ({orders.length})
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
                    <p style={{ color: 'var(--gray-dark)', marginBottom: '20px' }}>
                        {filter === 'all' ? 'Start ordering delicious meals!' : `No ${filter} orders`}
                    </p>
                    <a href="/menu" className="btn btn-primary">Browse Menu</a>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="card" style={{ position: 'relative' }}>
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-dark)' }}>
                                        <Clock size={16} />
                                        <span style={{ fontSize: '14px' }}>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </span>
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

                            {/* QR Code Section */}
                            {order.status !== 'Completed' && order.qrCode && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    padding: '20px',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                                        <AlertCircle size={18} color="var(--primary)" />
                                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                                            Show this QR code at the counter
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '20px',
                                        background: 'white',
                                        border: '3px dashed var(--primary)',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                        <QrCode size={80} color="var(--primary)" />
                                        <p style={{
                                            fontSize: '12px',
                                            marginTop: '10px',
                                            fontFamily: 'monospace',
                                            color: 'var(--gray-dark)',
                                            fontWeight: '600'
                                        }}>
                                            {order.qrCode}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Completed Badge */}
                            {order.status === 'Completed' && (
                                <div style={{
                                    background: 'rgba(0, 184, 148, 0.1)',
                                    padding: '15px',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    color: 'var(--success)'
                                }}>
                                    <CheckCircle size={20} />
                                    <span style={{ fontWeight: '600' }}>Order Completed</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
