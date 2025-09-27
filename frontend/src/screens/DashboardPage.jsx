import React, { useState, useEffect, useCallback } from 'react';
import config from '../constants';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newItemName, setNewItemName] = useState('');
  const [newPickup, setNewPickup] = useState('');
  const [newDropoff, setNewDropoff] = useState('');

  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user.role === 'customer') {
        const response = await manifest.from('Delivery').find({ filter: { customerId: user.id }, sort: { createdAt: 'desc' }, include: ['driver'] });
        setDeliveries(response.data);
      } else if (user.role === 'driver') {
        const myDeliveriesRes = await manifest.from('Delivery').find({ filter: { driverId: user.id }, sort: { createdAt: 'desc' }, include: ['customer'] });
        setDeliveries(myDeliveriesRes.data);
        const availableRes = await manifest.from('Delivery').find({ filter: { status: 'pending' }, sort: { createdAt: 'desc' }, include: ['customer'] });
        setAvailableDeliveries(availableRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, manifest]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleCreateDelivery = async (e) => {
    e.preventDefault();
    try {
      const newDelivery = await manifest.from('Delivery').create({ 
        itemName: newItemName, 
        pickupAddress: newPickup, 
        dropoffAddress: newDropoff,
        deliveryFee: 15.00, // Example fee
        customerId: user.id
      });
      setDeliveries([newDelivery, ...deliveries]);
      setNewItemName('');
      setNewPickup('');
      setNewDropoff('');
    } catch (error) {
      console.error('Failed to create delivery:', error);
    }
  };

  const handleUpdateStatus = async (delivery, newStatus) => {
    try {
      const updatedDelivery = await manifest.from('Delivery').update(delivery.id, { status: newStatus });
      fetchDeliveries(); // Refetch all to get latest state
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  const handleAcceptDelivery = async (delivery) => {
    try {
      const updatedDelivery = await manifest.from('Delivery').update(delivery.id, { status: 'accepted', driverId: user.id });
      fetchDeliveries(); // Refetch all
    } catch (error) {
      console.error('Failed to accept delivery:', error);
    }
  }

  const renderCustomerDashboard = () => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Request a New Delivery</h2>
        <form onSubmit={handleCreateDelivery} className="space-y-4">
          <input type="text" placeholder="Item Name (e.g., 'Laptop')" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full p-3 border rounded-lg" required />
          <input type="text" placeholder="Pickup Address" value={newPickup} onChange={e => setNewPickup(e.target.value)} className="w-full p-3 border rounded-lg" required />
          <input type="text" placeholder="Dropoff Address" value={newDropoff} onChange={e => setNewDropoff(e.target.value)} className="w-full p-3 border rounded-lg" required />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Request Delivery ($15.00)</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Deliveries</h2>
        <div className="space-y-4">
          {deliveries.map(d => (
            <div key={d.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{d.itemName}</p>
                <p className="text-sm text-gray-600">To: {d.dropoffAddress}</p>
                <p className="text-sm text-gray-500">Driver: {d.driver?.name || 'Unassigned'}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${d.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDriverDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Deliveries</h2>
            <div className="space-y-4">
                {availableDeliveries.map(d => (
                    <div key={d.id} className="p-4 border rounded-lg">
                        <p className="font-bold text-lg">{d.itemName}</p>
                        <p className="text-sm text-gray-600">From: {d.pickupAddress}</p>
                        <p className="text-sm text-gray-600">To: {d.dropoffAddress}</p>
                        <p className="font-semibold text-green-600 mt-2">Fee: ${d.deliveryFee}</p>
                        <button onClick={() => handleAcceptDelivery(d)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Accept</button>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Active Deliveries</h2>
            <div className="space-y-4">
                {deliveries.filter(d => d.status !== 'delivered').map(d => (
                    <div key={d.id} className="p-4 border rounded-lg">
                        <p className="font-bold text-lg">{d.itemName}</p>
                        <p className="text-sm text-gray-600">To: {d.dropoffAddress}</p>
                        <p className="text-sm text-gray-500">Customer: {d.customer?.name}</p>
                        <div className="flex space-x-2 mt-2">
                            {d.status === 'accepted' && <button onClick={() => handleUpdateStatus(d, 'in_progress')} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">Start Delivery</button>}
                            {d.status === 'in_progress' && <button onClick={() => handleUpdateStatus(d, 'delivered')} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">Mark as Delivered</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}! ({user.role})</span>
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? <p>Loading deliveries...</p> : (
            user.role === 'customer' ? renderCustomerDashboard() : renderDriverDashboard()
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
