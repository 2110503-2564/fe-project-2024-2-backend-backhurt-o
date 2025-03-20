'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiClock, FiWifi } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find Your Perfect Co-Working Space
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Book flexible workspaces, meeting rooms, and more at convenient locations.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href={isAuthenticated ? '/coworking-spaces' : '/auth/register'}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isAuthenticated ? 'Find Spaces' : 'Get Started'}{' '}
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for productive work
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our co-working spaces are designed to provide you with the best environment for focused work and networking.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <FiMapPin className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Convenient Locations</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Find spaces near you with easy access to transport and amenities.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <FiClock className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Flexible Bookings</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Book by the hour, day, or month with easy-to-use reservation system.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <FiWifi className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Modern Amenities</h3>
                  <p className="mt-2 text-base text-gray-500">
                    High-speed WiFi, ergonomic furniture, and coffee included in all spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to boost your productivity?</span>
            <span className="block text-indigo-600">Start using our co-working spaces today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href={isAuthenticated ? '/coworking-spaces' : '/auth/register'}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isAuthenticated ? 'Book Now' : 'Sign Up'}
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
