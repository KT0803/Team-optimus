"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../utils/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditMenuItem() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'breakfast',
        description: '',
        imageUrl: '',
        isAvailable: true
    });

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/menu/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch menu item details');
                router.push('/admin/menu');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put(`/menu/${id}`, formData);
            alert('Menu item updated successfully');
            router.push('/admin/menu');
        } catch (err) {
            console.error(err);
            alert('Failed to update menu item');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => router.back()}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px' }}
            >
                <ArrowLeft size={20} />
                Back to Menu
            </button>

            <div className="card glass" style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--dark)' }}>Edit Item</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div className="form-group">
                        <label className="label">Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <div className="form-group">
                            <label className="label">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="input"
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="snacks">Snacks</option>
                                <option value="dinner">Dinner</option>
                                <option value="beverages">Beverages</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input"
                            rows="4"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Image URL</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="input"
                                style={{ flex: 1 }}
                            />
                        </div>
                        {formData.imageUrl && (
                            <div style={{ marginTop: '10px', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden' }}>
                                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            id="isAvailable"
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label htmlFor="isAvailable" className="label" style={{ marginBottom: 0, cursor: 'pointer' }}>Available for ordering</label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '15px' }}
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
