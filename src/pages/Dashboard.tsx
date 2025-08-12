import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Student, Tutor } from '../types';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TutorDashboard from '../components/dashboard/TutorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'student' ? (
        <StudentDashboard student={user as Student} />
      ) : (
        <TutorDashboard tutor={user as Tutor} />
      )}
    </div>
  );
};

export default Dashboard;