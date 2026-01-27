import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { attendanceAPI, studentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './CRUD.css';

export default function Attendance() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    remarks: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    studentAPI.getAll({ page: 1, limit: 100 }).then((res) => {
      setStudents(res.data?.data || res.data || []);
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['attendances', page, limit],
    queryFn: () => attendanceAPI.getAll({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: attendanceAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => attendanceAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: attendanceAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  const resetForm = () => {
    setFormData({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'PRESENT',
      remarks: '',
    });
    setEditingAttendance(null);
  };

  const handleEdit = (attendance: any) => {
    setEditingAttendance(attendance);
    setFormData({
      studentId: attendance.studentId || '',
      date: attendance.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: attendance.status || 'PRESENT',
      remarks: attendance.remarks || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAttendance) {
      updateMutation.mutate({ id: editingAttendance.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const attendances = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'N/A';
  };

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Attendance Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Mark Attendance
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">No attendance records found</td>
                    </tr>
                  ) : (
                    attendances.map((attendance: any) => (
                      <tr key={attendance.id}>
                        <td>{getStudentName(attendance.studentId)}</td>
                        <td>{attendance.date?.split('T')[0] || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${attendance.status?.toLowerCase()}`}>
                            {attendance.status}
                          </span>
                        </td>
                        <td>{attendance.remarks || 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(attendance)}>
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this record?')) {
                                  deleteMutation.mutate(attendance.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingAttendance ? 'Edit Attendance' : 'Mark Attendance'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Student *</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                      <option value="EXCUSED">Excused</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingAttendance ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
