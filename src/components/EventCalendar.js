import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsData);
    });
    return unsubscribe;
  }, []);

  const addEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.description) {
      try {
        if (editEventId !== null) {
          await updateDoc(doc(firestore, 'events', editEventId), newEvent);
          setEditEventId(null);
        } else {
          await addDoc(collection(firestore, 'events'), newEvent);
        }
        setNewEvent({ title: '', date: '', description: '' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const editEvent = (event) => {
    setNewEvent({ title: event.title, date: event.date, description: event.description });
    setEditEventId(event.id);
  };

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'events', id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="event-calendar">
      <h2>Event Calendar</h2>
      <ul>
        {events.map(event => (
          <li key={event.id} className="event-item">
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.description}</p>
            <button onClick={() => editEvent(event)}>Edit</button>
            <button onClick={() => deleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{editEventId ? 'Edit Event' : 'Add New Event'}</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <input
          type="date"
          value={newEvent.date}
          onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
        />
      </div>
      <button onClick={addEvent}>{editEventId ? 'Update Event' : 'Add Event'}</button>
    </div>
  );
}

export default EventCalendar;
