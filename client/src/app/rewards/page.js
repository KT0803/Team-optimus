"use client";
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Gift, Award, History, Coffee, Pizza, IceCream } from 'lucide-react';

export default function Rewards() {

    
    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Your Rewards
                </h2>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    Earn points with every meal and redeem for perks!
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                {/* Balance Card */}
                <div className="card" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '40px 20px'
                }}>
                    <Award size={48} style={{ marginBottom: '15px', opacity: 0.9 }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', opacity: 0.9 }}>Current Balance</h3>
                    <div style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1 }}>{balance}</div>
                    <div style={{ fontSize: '1rem', opacity: 0.8, marginTop: '5px' }}>Points</div>
                </div>

                {/* Redeem Section */}
                <div className="card">
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Gift size={24} color="var(--primary)" />
                        Redeem Points
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {redeemableItems.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                background: 'var(--light)',
                                borderRadius: '10px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--gray-dark)' }}>{item.points} pts</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRedeem(item)}
                                    className="btn btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                                    disabled={balance < item.points}
                                >
                                    Redeem
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <History size={24} />
                    History
                </h3>
                <div className="card">
                    {history.length === 0 ? (
                        <p className="text-center text-gray-500">No history yet.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '12px 10px', color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '12px 10px' }}>{item.description}</td>
                                        <td style={{
                                            padding: '12px 10px',
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            color: item.type === 'EARNED' ? '#10b981' : '#ef4444'
                                        }}>
                                            {item.type === 'EARNED' ? '+' : '-'}{item.points}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
