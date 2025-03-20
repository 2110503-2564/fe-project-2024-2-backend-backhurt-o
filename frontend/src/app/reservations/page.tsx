'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { FiCalendar, FiMapPin, FiClock, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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

const ReservationsPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
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
      setCancelSuccess('Reservation cancelled successfully');
      // Update the local state
      setReservations(reservations.map(res => 
        res._id === id ? { ...res, status: 'cancelled' } : res
      ));
      setTimeout(() => setCancelSuccess(''), 3000);
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError('Failed to cancel reservation. Please try again.');
      setTimeout(() => setError(''), 3000);
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

  const isUpcoming = (dateString: string, timeSlot: string) => {
    const now = new Date();
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    if (date < now) return false;
    if (date > now) return true;
    
    // Check if time slot is in the future today
    const currentHour = now.getHours();
    const slotEndHour = parseInt(timeSlot.split(' - ')[1].split(':')[0]);
    
    return currentHour < slotEndHour;
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
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Reservations
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your co-working space reservations
            </p>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <Link
              href="/coworking-spaces"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FiCalendar className="-ml-1 mr-2 h-5 w-5" />
              Book New Space
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {cancelSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-sm text-green-600">{cancelSuccess}</div>
          </div>
        )}

        <div className="mt-8">
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
              <p className="text-gray-500">You don't have any reservations yet.</p>
              <Link
                href="/coworking-spaces"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Book a Space Now
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {reservations.map((reservation) => {
                  const isActive = reservation.status === 'active';
                  const isPast = !isUpcoming(reservation.date, reservation.timeSlot);
                  
                  return (
                    <li key={reservation._id} className="px-4 py-4 sm:px-6">
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
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`flex items-center ${isActive ? 'text-green-500' : 'text-red-500'}`}>
                            {isActive ? (
                              <>
                                <FiCheckCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Active</span>
                              </>
                            ) : (
                              <>
                                <FiX className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Cancelled</span>
                              </>
                            )}
                          </div>
                          
                          {isActive && !isPast && (
                            <button
                              onClick={() => cancelReservation(reservation._id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          )}
                          
                          {isPast && isActive && (
                            <span className="text-xs text-gray-500">Past reservation</span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage; 