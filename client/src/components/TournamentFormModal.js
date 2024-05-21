import React, { useState } from 'react';

const TournamentFormModal = ({ isOpen, toggleModal }) => {
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        active: true
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { ...formData };
            const response = await fetch("http://localhost:4000/tournaments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
            toggleModal(false); // Close modal after submit
        } catch (err) {
            console.error(err.message);
        }
    };

    return isOpen ? (
        <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Tournament Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br /><br />

                <label htmlFor="start_date">Start Date:</label>
                <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} /><br /><br />

                <label htmlFor="end_date">End Date:</label>
                <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} /><br /><br />

                <label htmlFor="active">Active:</label>
                <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleChange} />

                <button type="submit">Create Tournament</button>
                <button type="button" onClick={() => toggleModal(false)}>Cancel</button>
            </form>
        </div>
    ) : null;
};

export default TournamentFormModal;
