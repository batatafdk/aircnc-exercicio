import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './style.css'
import { async } from 'q';
import { request } from 'https';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://192.168.1.11:3333', {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([...requests, data])
        })
    }, [requests, socket]);


    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);
        }

        loadSpots()
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);

        setRequests(requests.filter(r => r._id !== id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/approvals`);

        setRequests(requests.filter(r => r._id !== id));
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(r => (
                    <li key={r._id}>
                        <p>
                            <strong>{r.user.email}
                            </strong> está soliciando uma reserva  em <strong>{r.spot.company}</strong>
                            para a data: <strong>{r.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleAccept(r._id)}>ACEITAR</button>
                        <button className="reject" onClick={() => handleReject(r._id)}>REJEITAR</button>
                    </li>
                ))}
            </ul>
            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>

            <Link to="/new">
                <button className="btn">
                    Cadastrar novo spot
                </button>
            </Link>
        </>
    )
}