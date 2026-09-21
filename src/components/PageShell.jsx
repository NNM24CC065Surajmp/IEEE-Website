import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function PageShell({ title, subtitle }) {
  return (
    <div className="pt-28 section-container section-padding text-center">
      <Reveal>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="py-12">
          <p className="text-slate-500 italic mb-8">Coming soon</p>
          <Link to="/" className="btn-outline">
            Return Home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
