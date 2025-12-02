"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { MessageSquare, Star, User, Calendar, ThumbsUp, Filter } from 'lucide-react';

export default function AllFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState('all');
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.role || user.role.toLowerCase() !== 'admin') {
            router.push('/login');
            return;
        }
        fetchFeedbacks();
    }, [router]);

    const fetchFeedbacks = async () => {
        try {
            const res = await api.get('/feedback');
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch feedbacks');
        } finally {
            setLoading(false);
        }
    };

    const filteredFeedbacks = filterRating === 'all'
        ? feedbacks
        : feedbacks.filter(f => f.rating === parseInt(filterRating));

    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={18}
                        fill={star <= rating ? '#FFB142' : 'none'}
                        color={star <= rating ? '#FFB142' : 'var(--gray)'}
                    />
                ))}
            </div>
        );
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px' }}>All Feedbacks</h1>
                    <p style={{ color: 'var(--gray-dark)' }}>View and analyze customer feedback</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Filter size={20} color="var(--gray-dark)" />
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="input"
                        style={{ minWidth: '150px' }}
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Feedbacks</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--dark)' }}>{feedbacks.length}</h3>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Average Rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#FFB142' }}>{averageRating}</h3>
                        <Star size={24} fill="#FFB142" color="#FFB142" />
                    </div>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>5 Star Reviews</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--success)' }}>
                        {feedbacks.filter(f => f.rating === 5).length}
                    </h3>
                </div>
                <div className="card glass" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>Positive Rate</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {feedbacks.length > 0
                            ? Math.round((feedbacks.filter(f => f.rating >= 4).length / feedbacks.length) * 100)
                            : 0}%
                    </h3>
                </div>
            </div>

            {/* Feedbacks List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {filteredFeedbacks.map(feedback => (
                    <div key={feedback.id} className="card glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* User Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '1.1rem'
                                }}>
                                    {feedback.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--dark)', marginBottom: '2px' }}>
                                        {feedback.user?.name || 'Anonymous'}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-dark)' }}>
                                        {feedback.user?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            {renderStars(feedback.rating)}
                        </div>

                        {/* Comment */}
                        {feedback.comment && (
                            <div style={{
                                background: 'rgba(0,0,0,0.02)',
                                padding: '15px',
                                borderRadius: '12px',
                                borderLeft: '3px solid var(--primary)'
                            }}>
                                <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                                    "{feedback.comment}"
                                </p>
                            </div>
                        )}

                        {/* Date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-dark)', fontSize: '0.85rem', marginTop: 'auto' }}>
                            <Calendar size={14} />
                            <span>{new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>

                        {/* Rating Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: feedback.rating >= 4 ? 'var(--success)' : feedback.rating === 3 ? '#FFB142' : 'var(--danger)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {feedback.rating >= 4 ? <ThumbsUp size={12} /> : null}
                            {feedback.rating}/5
                        </div>
                    </div>
                ))}
            </div>

            {filteredFeedbacks.length === 0 && (
                <div className="card glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <MessageSquare size={48} color="var(--gray)" style={{ margin: '0 auto 20px' }} />
                    <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>No feedbacks found</p>
                </div>
            )}
        </div>
    );
}
