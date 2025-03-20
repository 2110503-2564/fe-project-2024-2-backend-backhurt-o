'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { FiCalendar, FiMapPin, FiClock, FiX, FiCheckCircle } from 'react-icons/fi';

interface Reservation {
  _id: string;
  coworkingSpace: {
    _id: string;
    name: string;
    location: string;
  };
  date: string;
  timeSlot: string;
  status: string;
}

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations/my');
      setReservations(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load your reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      await api.put(`/reservations/${id}/cancel`);
      fetchReservations(); // Refresh the list after cancellation
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError('Failed to cancel reservation. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Welcome, {user?.name}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your co-working space reservations here.
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <FiCalendar className="mr-2" /> Your Upcoming Reservations
              </h3>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}
              
              {reservations.length === 0 ? (
                <div className="mt-6 text-center text-gray-500 py-4">
                  <p>You don't have any upcoming reservations.</p>
                  <Link 
                    href="/coworking-spaces" 
                    className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book a Space Now
                  </Link>
                </div>
              ) : (
                <div className="mt-6 overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <li key={reservation._id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                              <FiMapPin className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">
                                {reservation.coworkingSpace.name}
                              </h4>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{reservation.coworkingSpace.location}</p>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{formatDate(reservation.date)}</p>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{reservation.timeSlot}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {reservation.status === 'active' ? (
                              <div className="flex items-center mr-4">
                                <FiCheckCircle className="h-5 w-5 text-green-500" />
                                <span className="ml-1 text-sm text-green-500">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center mr-4">
                                <FiX className="h-5 w-5 text-red-500" />
                                <span className="ml-1 text-sm text-red-500">Cancelled</span>
                              </div>
                            )}
                            
                            {reservation.status === 'active' && (
                              <button
                                onClick={() => cancelReservation(reservation._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link
            href="/coworking-spaces"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Find More Spaces
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 