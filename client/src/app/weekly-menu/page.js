"use client";
import { useState, useEffect } from 'react';
import { Calendar, Clock, Coffee, Sun, Moon, Utensils, AlertCircle } from 'lucide-react';

export default function WeeklyMenu() {
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
