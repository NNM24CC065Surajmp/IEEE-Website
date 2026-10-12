import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pt-28 section-container section-padding text-center flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold font-heading mb-4 text-ieee-blue">404</h1>
      <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}
