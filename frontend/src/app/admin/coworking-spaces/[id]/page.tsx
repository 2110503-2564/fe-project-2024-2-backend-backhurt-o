'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FiMapPin, FiUsers, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface CoworkingSpace {
  _id: string;
  name: string;
  location: string;
  availableSeats: number;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
}

interface Reservation {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  timeSlot: string;
  status: string;
}

const CoworkingSpaceDetailAdminPage = ({ params }: { params: { id: string } }) => {
  // Safely unwrap params using React.use()
  const resolvedParams = React.use(params);
  const spaceId = resolvedParams.id;
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [space, setSpace] = useState<CoworkingSpace | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      
      if (user && user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      if (spaceId) {
        fetchData();
      }
    }
  }, [isAuthenticated, isLoading, user, router, spaceId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [spaceResponse, reservationsResponse] = await Promise.all([
        api.get(`/coworking-spaces/${spaceId}`),
        api.get('/reservations'),
      ]);
      
      setSpace(spaceResponse.data.data);
      
      // Filter reservations for this space
      const spaceReservations = reservationsResponse.data.data.filter(
        (r: Reservation) => r.coworkingSpace === spaceId
      );
      setReservations(spaceReservations);
      
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCoworkingSpace = async () => {
    if (!confirm('Are you sure you want to delete this co-working space? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/coworking-spaces/${spaceId}`);
      setSuccess('Co-working space deleted successfully');
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      console.error('Error deleting co-working space:', err);
      setError('Failed to delete co-working space. Please try again.');
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

  if (!space) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Co-working space not found.</p>
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-1" /> Back to Admin Dashboard
          </Link>
        </div>
        
        <div className="lg:flex lg:items-center lg:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {space.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              <FiMapPin className="mr-1" /> {space.location}
            </p>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4 space-x-3">
            <Link
              href={`/admin/coworking-spaces/${spaceId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiEdit2 className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Edit
            </Link>
            <button
              onClick={deleteCoworkingSpace}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-sm text-green-600">{success}</div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Co-working Space Details</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2" /> Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{space.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2" /> Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{space.location}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiUsers className="mr-2" /> Available Seats
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{space.availableSeats}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2" /> Coordinates
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Longitude: {space.coordinates.coordinates[0]}, Latitude: {space.coordinates.coordinates[1]}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Reservations for this Space</h2>
          </div>
          <div className="border-t border-gray-200">
            {reservations.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No reservations found for this space.
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              User
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date & Time
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reservations.map((reservation) => (
                            <tr key={reservation._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{reservation.user.name}</div>
                                <div className="text-sm text-gray-500">{reservation.user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                                <div className="text-sm text-gray-500">{reservation.timeSlot}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    reservation.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {reservation.status === 'active' ? 'Active' : 'Cancelled'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoworkingSpaceDetailAdminPage; 