'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/game';

export const Leaderboard: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('elo_rating', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setProfiles(data as UserProfile[]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <h3>🏆 Global Leaderboard</h3>
      <div className="leaderboard-list">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="leaderboard-item">
            <span className="rank">{index + 1}</span>
            <span className="username">{profile.username || 'Guest'}</span>
            <span className="elo">{profile.elo_rating} ELO</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .leaderboard-container {
          margin-top: 2rem;
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 14px;
          width: 100%;
          max-width: 420px;
        }
        h3 { margin-bottom: 1rem; text-align: center; color: var(--text-color); }
        .leaderboard-list { display: flex; flex-direction: column; gap: 10px; }
        .leaderboard-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: var(--bg-color);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        .rank { font-weight: 800; color: var(--o-color); }
        .username { flex: 1; margin-left: 15px; }
        .elo { color: var(--x-color); font-weight: 600; }
      `}</style>
    </div>
  );
};
