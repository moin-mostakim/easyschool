import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { parentAPI, schoolAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './CRUD.css';

export default function Parents() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
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
    queryKey: ['parents', page, limit, formData.schoolId],
    queryFn: () => parentAPI.getAll({ page, limit, schoolId: formData.schoolId || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: parentAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setShowModal(false);
      resetForm();
      showSuccess('Parent created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create parent';
      showError(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => parentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setShowModal(false);
      resetForm();
      showSuccess('Parent updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update parent';
      showError(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: parentAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      showSuccess('Parent deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete parent';
      showError(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: '',
      schoolId: user?.schoolId || '',
    });
    setEditingParent(null);
  };

  const handleEdit = (parent: any) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.firstName || '',
      lastName: parent.lastName || '',
      email: parent.email || '',
      phone: parent.phone || '',
      relationship: parent.relationship || '',
      schoolId: parent.schoolId || user?.schoolId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParent) {
      updateMutation.mutate({ id: editingParent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const parents = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Parents Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Parent
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
                    <th>Phone</th>
                    <th>Relationship</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">No parents found</td>
                    </tr>
                  ) : (
                    parents.map((parent: any) => (
                      <tr key={parent.id}>
                        <td>{parent.firstName} {parent.lastName}</td>
                        <td>{parent.email}</td>
                        <td>{parent.phone}</td>
                        <td>{parent.relationship}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(parent)}>
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this parent?')) {
                                  deleteMutation.mutate(parent.id);
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
              <h3>{editingParent ? 'Edit Parent' : 'Add New Parent'}</h3>
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
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
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
                    {editingParent ? 'Update' : 'Create'}
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
