"use client";
import { useState, useEffect } from 'react';
import { Calendar, Clock, Coffee, Sun, Moon, Utensils, AlertCircle } from 'lucide-react';

export default function WeeklyMenu() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = [
        { name: 'Breakfast', icon: <Coffee size={18} />, time: '7:30 AM - 9:30 AM' },
        { name: 'Lunch', icon: <Sun size={18} />, time: '12:30 PM - 2:30 PM' },
        { name: 'Snacks', icon: <Utensils size={18} />, time: '4:30 PM - 5:30 PM' },
        { name: 'Dinner', icon: <Moon size={18} />, time: '7:30 PM - 9:30 PM' }
    ];

    // Mock Data - Fallback if API fails
    const mockSchedule = {
        Monday: {
            Breakfast: 'Idli Sambar, Chutney, Tea/Coffee',
            Lunch: 'Rice, Dal Fry, Aloo Gobi, Chapati, Salad, Curd',
            Snacks: 'Samosa, Tea',
            Dinner: 'Veg Pulao, Raita, Paneer Butter Masala, Chapati'
        },
        Tuesday: {
            Breakfast: 'Poha, Sev, Tea/Coffee',
            Lunch: 'Rice, Rajma Masala, Bhindi Fry, Chapati, Salad, Pickle',
            Snacks: 'Biscuits, Tea',
            Dinner: 'Egg Curry / Paneer Curry, Rice, Chapati'
        },
        Wednesday: {
            Breakfast: 'Upma, Chutney, Tea/Coffee',
            Lunch: 'Rice, Dal Tadka, Mix Veg, Chapati, Salad, Papad',
            Snacks: 'Vada Pav, Tea',
            Dinner: 'Chicken Biryani / Veg Biryani, Raita, Salan'
        },
        Thursday: {
            Breakfast: 'Paratha, Curd, Pickle, Tea/Coffee',
            Lunch: 'Rice, Chole Masala, Jeera Aloo, Chapati, Salad',
            Snacks: 'Maggi, Tea',
            Dinner: 'Dal Makhani, Jeera Rice, Chapati, Sweet'
        },
        Friday: {
            Breakfast: 'Dosa, Sambar, Chutney, Tea/Coffee',
            Lunch: 'Rice, Sambar, Poriyal, Chapati, Salad, Curd',
            Snacks: 'Sandwich, Tea',
            Dinner: 'Fried Rice, Manchurian, Noodles'
        },
        Saturday: {
            Breakfast: 'Puri Bhaji, Tea/Coffee',
            Lunch: 'Rice, Kadi Pakora, Karela Fry, Chapati, Salad',
            Snacks: 'Bhel Puri, Tea',
            Dinner: 'Khichdi, Kadhi, Papad, Pickle'
        },
        Sunday: {
            Breakfast: 'Bread Omelette / Bread Jam, Tea/Coffee',
            Lunch: 'Special Thali (Paneer/Chicken, Sweet, Farsan)',
            Snacks: 'Cake/Pastry, Tea',
            Dinner: 'Light Dinner (Soup, Salad, Bread)'
        }
    };

    const [activeDay, setActiveDay] = useState('Monday');
    const [weeklySchedule, setWeeklySchedule] = useState(mockSchedule);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeeklyMenu();
    }, []);

    const fetchWeeklyMenu = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8000/api/weekly-menu/current');

            if (!response.ok) {
                throw new Error('Failed to fetch weekly menu');
            }

            const data = await response.json();

            // Convert API data to the expected format
            const formattedSchedule = {};
            Object.keys(data).forEach(day => {
                const capitalizedDay = day.charAt(0) + day.slice(1).toLowerCase();
                formattedSchedule[capitalizedDay] = {
                    Breakfast: data[day].BREAKFAST || 'No menu available',
                    Lunch: data[day].LUNCH || 'No menu available',
                    Snacks: data[day].SNACKS || 'No menu available',
                    Dinner: data[day].DINNER || 'No menu available'
                };
            });

            // Check if we got any data
            if (Object.keys(formattedSchedule).length > 0) {
                setWeeklySchedule(formattedSchedule);
            } else {
                // Use mock data as fallback
                console.log('No menu data available, using mock data');
            }
        } catch (err) {
            console.error('Error fetching weekly menu:', err);
            setError(err.message);
            // Keep using mock data as fallback
        } finally {
            setLoading(false);
        }
    };

        return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Weekly Mess Menu
                </h1>
                <p style={{ color: 'var(--gray-dark)', fontSize: '1.1rem' }}>
                    Plan your meals for the week ahead
                </p>

                <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                <p>* Menu is subject to change based on availability of ingredients.</p>
            </div>
        </div>
        </div>
    );
}
