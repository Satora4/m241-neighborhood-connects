import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function LocalBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [newBusiness, setNewBusiness] = useState({ name: '', description: '', address: '' });
  const [editBusinessId, setEditBusinessId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'businesses'), (snapshot) => {
      const businessesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBusinesses(businessesData);
    });
    return unsubscribe;
  }, []);

  const addBusiness = async () => {
    if (newBusiness.name && newBusiness.description && newBusiness.address) {
      try {
        if (editBusinessId !== null) {
          await updateDoc(doc(firestore, 'businesses', editBusinessId), newBusiness);
          setEditBusinessId(null);
        } else {
          await addDoc(collection(firestore, 'businesses'), newBusiness);
        }
        setNewBusiness({ name: '', description: '', address: '' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const editBusiness = (business) => {
    setNewBusiness({ name: business.name, description: business.description, address: business.address });
    setEditBusinessId(business.id);
  };

  const deleteBusiness = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'businesses', id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="local-businesses">
      <h2>Local Businesses</h2>
      <ul>
        {businesses.map(business => (
          <li key={business.id} className="business-item">
            <h3>{business.name}</h3>
            <p>{business.description}</p>
            <p>{business.address}</p>
            <button onClick={() => editBusiness(business)}>Edit</button>
            <button onClick={() => deleteBusiness(business.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{editBusinessId ? 'Edit Business' : 'Add New Business'}</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Business Name"
          value={newBusiness.name}
          onChange={e => setNewBusiness({ ...newBusiness, name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Business Description"
          value={newBusiness.description}
          onChange={e => setNewBusiness({ ...newBusiness, description: e.target.value })}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Business Address"
          value={newBusiness.address}
          onChange={e => setNewBusiness({ ...newBusiness, address: e.target.value })}
        />
      </div>
      <button onClick={addBusiness}>{editBusinessId ? 'Update Business' : 'Add Business'}</button>
    </div>
  );
}

export default LocalBusinesses;
