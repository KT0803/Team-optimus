"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { Plus, Edit2, Trash2, Search, Filter, Save, X, Package } from 'lucide-react';

export default function ManageMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '100',
        preparationTime: '',
        isAvailable: true
    });
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

    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditForm({
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity || 100,
            preparationTime: item.preparationTime || '',
            isAvailable: item.isAvailable
        });
    };

    const handleSaveEdit = async (id) => {
        try {
            const res = await api.put(`/menu/${id}`, editForm);
            setMenuItems(menuItems.map(item => item.id === id ? res.data : item));
            setEditingId(null);
            alert('Item updated successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to update item');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/menu', newItem);
            setMenuItems([...menuItems, res.data]);
            setShowAddForm(false);
            setNewItem({
                name: '',
                category: '',
                price: '',
                quantity: '100',
                preparationTime: '',
                isAvailable: true
            });
            alert('Item added successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to add item');
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
        <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px' }}>Manage Menu</h1>
                    <p style={{ color: 'var(--gray-dark)' }}>Full CRUD operations for menu items</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
                <div className="card glass" style={{ padding: '30px', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: 'var(--dark)' }}>Add New Menu Item</h3>
                    <form onSubmit={handleAddItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--dark)' }}>Name *</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--dark)' }}>Category *</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--dark)' }}>Price (₹) *</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                className="input"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--dark)' }}>Quantity *</label>
                            <input
                                type="number"
                                required
                                className="input"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--dark)' }}>Prep Time</label>
                            <input
                                type="text"
                                placeholder="e.g., 15 mins"
                                className="input"
                                value={newItem.preparationTime}
                                onChange={(e) => setNewItem({ ...newItem, preparationTime: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', gridColumn: 'span 1' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Item</button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

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

            {/* Menu Items Table */}
            <div className="card glass" style={{ padding: '0', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(108, 92, 231, 0.05)', borderBottom: '2px solid rgba(108, 92, 231, 0.1)' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700', color: 'var(--dark)' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700', color: 'var(--dark)' }}>Category</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700', color: 'var(--dark)' }}>Price (₹)</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700', color: 'var(--dark)' }}>Quantity</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700', color: 'var(--dark)' }}>Prep Time</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '700', color: 'var(--dark)' }}>Available</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '700', color: 'var(--dark)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--gray)' }}>
                                {editingId === item.id ? (
                                    <>
                                        <td style={{ padding: '15px' }}>
                                            <input
                                                type="text"
                                                className="input"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <input
                                                type="text"
                                                className="input"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <input
                                                type="number"
                                                className="input"
                                                value={editForm.quantity}
                                                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <input
                                                type="text"
                                                className="input"
                                                value={editForm.preparationTime}
                                                onChange={(e) => setEditForm({ ...editForm, preparationTime: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={editForm.isAvailable}
                                                onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleSaveEdit(item.id)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <Save size={14} /> Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="btn btn-outline"
                                                    style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ padding: '15px', fontWeight: '600', color: 'var(--dark)' }}>{item.name}</td>
                                        <td style={{ padding: '15px', color: 'var(--gray-dark)' }}>
                                            <span style={{
                                                background: 'rgba(108, 92, 231, 0.1)',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                color: 'var(--primary)'
                                            }}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', fontWeight: '700', color: 'var(--primary)' }}>₹{item.price}</td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Package size={16} color="var(--gray-dark)" />
                                                <span style={{ fontWeight: '600', color: item.quantity < 20 ? 'var(--danger)' : 'var(--dark)' }}>
                                                    {item.quantity || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px', color: 'var(--gray-dark)', fontSize: '0.9rem' }}>{item.preparationTime || '-'}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: item.isAvailable ? 'rgba(0, 184, 148, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                                                color: item.isAvailable ? 'var(--success)' : 'var(--danger)'
                                            }}>
                                                {item.isAvailable ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '8px 12px', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredItems.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-dark)' }}>
                        No menu items found
                    </div>
                )}
            </div>
        </div>
    );
}
