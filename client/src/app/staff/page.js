"use client";
import { useState } from 'react';
import api from '../../utils/api';
import { Scan, CheckCircle, XCircle, Package, User } from 'lucide-react';

export default function Staff() {
    const [qrCode, setQrCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
                    Staff Dashboard
                </h2>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    Scan and validate customer orders
                </p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* QR Scanner Card */}
                <div className="card" style={{ marginBottom: '30px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Scan size={32} color="white" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>QR Code Validator</h3>
                            <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>
                                Enter QR code to validate orders
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleScan}>
                        <div className="form-group">
                            <label>QR Code</label>
                            <input
                                type="text"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                placeholder="Enter or scan QR code"
                                required
                                style={{ fontSize: '16px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <Scan size={20} />
                            {loading ? 'Validating...' : 'Validate QR Code'}
                        </button>
                    </form>
                </div>

                {/* Success Result */}
                {result && (
                    <div className="card" style={{
                        borderLeft: '5px solid var(--success)',
                        background: 'rgba(0, 184, 148, 0.05)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CheckCircle size={28} color="white" />
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--success)', fontSize: '1.3rem', marginBottom: '4px' }}>
                                    {result.message}
                                </h4>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>
                                    Type: <strong>{result.type}</strong>
                                </p>
                            </div>
                        </div>

                        {result.data.user && (
                            <div style={{
                                padding: '15px',
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <User size={18} color="var(--gray-dark)" />
                                    <p style={{ fontWeight: '600' }}>Customer Details</p>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>
                                    <strong>Name:</strong> {result.data.user.name}
                                </p>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>
                                    <strong>Email:</strong> {result.data.user.email}
                                </p>
                            </div>
                        )}

                        {result.type === 'ORDER' && result.data.orderItems && (
                            <div style={{
                                padding: '15px',
                                background: 'white',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <Package size={18} color="var(--gray-dark)" />
                                    <p style={{ fontWeight: '600' }}>Order Items</p>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {result.data.orderItems.map(item => (
                                        <li
                                            key={item.id}
                                            style={{
                                                padding: '8px 0',
                                                borderBottom: '1px solid var(--gray)',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <span>{item.menuItem.name}</span>
                                            <span style={{ fontWeight: '600' }}>x {item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: 'var(--light)',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <strong>Total Amount:</strong>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                                        ₹{result.data.totalAmount}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Result */}
                {error && (
                    <div className="card" style={{
                        borderLeft: '5px solid var(--danger)',
                        background: 'rgba(214, 48, 49, 0.05)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--danger)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <XCircle size={28} color="white" />
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--danger)', fontSize: '1.3rem', marginBottom: '4px' }}>
                                    Validation Failed
                                </h4>
                                <p style={{ fontSize: '14px', color: 'var(--gray-dark)' }}>{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
