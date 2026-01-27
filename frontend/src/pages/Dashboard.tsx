import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { studentAPI, teacherAPI, parentAPI, schoolAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: studentsData } = useQuery({
    queryKey: ['students', 'dashboard'],
    queryFn: () => studentAPI.getAll({ page: 1, limit: 5 }),
    enabled: user?.role !== 'student',
  });

  const { data: teachersData } = useQuery({
    queryKey: ['teachers', 'dashboard'],
    queryFn: () => teacherAPI.getAll({ page: 1, limit: 5 }),
    enabled: user?.role === 'super_admin' || user?.role === 'school_admin',
  });

  const { data: parentsData } = useQuery({
    queryKey: ['parents', 'dashboard'],
    queryFn: () => parentAPI.getAll({ page: 1, limit: 5 }),
    enabled: user?.role === 'super_admin' || user?.role === 'school_admin',
  });

  const { data: schoolsData } = useQuery({
    queryKey: ['schools', 'dashboard'],
    queryFn: () => schoolAPI.getAll({ page: 1, limit: 5 }),
    enabled: user?.role === 'super_admin',
  });

  const students = studentsData?.data?.data || studentsData?.data || [];
  const teachers = teachersData?.data?.data || teachersData?.data || [];
  const parents = parentsData?.data?.data || parentsData?.data || [];
  const schools = schoolsData?.data?.data || schoolsData?.data || [];

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-info">
              <h3>Students</h3>
              <p className="stat-number">{students.length}+</p>
            </div>
          </div>
          {user?.role === 'super_admin' && (
            <div className="stat-card">
              <div className="stat-icon">🏫</div>
              <div className="stat-info">
                <h3>Schools</h3>
                <p className="stat-number">{schools.length}+</p>
              </div>
            </div>
          )}
          {(user?.role === 'super_admin' || user?.role === 'school_admin') && (
            <>
              <div className="stat-card">
                <div className="stat-icon">👨‍🏫</div>
                <div className="stat-info">
                  <h3>Teachers</h3>
                  <p className="stat-number">{teachers.length}+</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍👩‍👧</div>
                <div className="stat-info">
                  <h3>Parents</h3>
                  <p className="stat-number">{parents.length}+</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
          <p>Role: <strong>{user?.role}</strong></p>
          {user?.schoolId && <p>School ID: <strong>{user.schoolId}</strong></p>}
        </div>
      </div>
    </Layout>
  );
}
