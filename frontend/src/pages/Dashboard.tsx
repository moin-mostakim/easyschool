import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h1 style={{ color: '#333' }}>EasySchool Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#666' }}>
              Welcome, {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <button onClick={logout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>User Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Role:</strong> {user?.role}
            </div>
            <div>
              <strong>School ID:</strong> {user?.schoolId || 'N/A'}
            </div>
            <div>
              <strong>Permissions:</strong> {user?.permissions?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Students</h3>
            <p style={{ color: '#666' }}>Manage student profiles and academic data</p>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Attendance</h3>
            <p style={{ color: '#666' }}>Track daily student attendance</p>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Exams</h3>
            <p style={{ color: '#666' }}>Manage exams and results</p>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Fees</h3>
            <p style={{ color: '#666' }}>Track fees and payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
