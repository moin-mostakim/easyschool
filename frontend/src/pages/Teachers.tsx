import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { teacherAPI, schoolAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './CRUD.css';

export default function Teachers() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    qualification: '',
    schoolId: user?.schoolId || '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.role === 'super_admin') {
      schoolAPI.getAll({ page: 1, limit: 100 }).then((res) => {
        setSchools(res.data?.data || res.data || []);
      });
    }
  }, [user]);

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', page, limit, formData.schoolId],
    queryFn: () => teacherAPI.getAll({ page, limit, schoolId: formData.schoolId || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: teacherAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setShowModal(false);
      resetForm();
      showSuccess('Teacher created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create teacher';
      showError(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teacherAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setShowModal(false);
      resetForm();
      showSuccess('Teacher updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update teacher';
      showError(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      showSuccess('Teacher deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete teacher';
      showError(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      qualification: '',
      schoolId: user?.schoolId || '',
    });
    setEditingTeacher(null);
  };

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      subject: teacher.subject || '',
      qualification: teacher.qualification || '',
      schoolId: teacher.schoolId || user?.schoolId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const teachers = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Teachers Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Teacher
          </button>
        </div>

        {user?.role === 'super_admin' && (
          <div className="filter-section">
            <select
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              className="filter-select"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Qualification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">No teachers found</td>
                    </tr>
                  ) : (
                    teachers.map((teacher: any) => (
                      <tr key={teacher.id}>
                        <td>{teacher.firstName} {teacher.lastName}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.subject}</td>
                        <td>{teacher.qualification}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(teacher)}>
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this teacher?')) {
                                  deleteMutation.mutate(teacher.id);
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
              <h3>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualification *</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {user?.role === 'super_admin' && (
                  <div className="form-group">
                    <label>School</label>
                    <select
                      value={formData.schoolId}
                      onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                      required
                    >
                      <option value="">Select School</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTeacher ? 'Update' : 'Create'}
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
