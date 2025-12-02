"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

export default function AdminMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.role || user.role.toLowerCase() !== 'admin') {
            router.push('/login');
            return;
        }
        fetchMenuItems();
    }, [router]);

    const fetchMenuItems = async () => {
        try {
            const res = await api.get('/menu');
            setMenuItems(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/menu/${id}`);
                setMenuItems(menuItems.filter(item => item.id !== id));
                alert('Item deleted successfully');
            } catch (err) {
                console.error(err);
                alert('Failed to delete item');
            }
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px' }}>Menu Management</h1>
                    <p style={{ color: 'var(--gray-dark)' }}>Manage your food items, prices, and availability</p>
                </div>
                <button
                    onClick={() => router.push('/admin/menu/add')}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Filters */}
            <div className="card glass" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '45px', width: '100%' }}
                    />
                </div>
                <div style={{ minWidth: '200px', position: 'relative' }}>
                    <Filter size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '45px', width: '100%', appearance: 'none' }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Menu Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {filteredItems.map(item => (
                    <div key={item.id} className="card glass" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={item.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {!item.isAvailable && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    Unavailable
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--dark)' }}>{item.name}</h3>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>₹{item.price}</span>
                            </div>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>{item.description}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <button
                                    onClick={() => router.push(`/admin/menu/edit/${item.id}`)}
                                    className="btn btn-outline"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="btn btn-outline"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
