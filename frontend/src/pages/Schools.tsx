import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { schoolAPI } from '../services/api';
import './CRUD.css';

export default function Schools() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    domain: '',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page, limit],
    queryFn: () => schoolAPI.getAll({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: schoolAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => schoolAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setShowModal(false);
      resetForm();
    },
  });

  const approveMutation = useMutation({
    mutationFn: schoolAPI.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: schoolAPI.suspend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', email: '', domain: '' });
    setEditingSchool(null);
  };

  const handleEdit = (school: any) => {
    setEditingSchool(school);
    setFormData({
      name: school.name || '',
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || '',
      domain: school.domain || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchool) {
      updateMutation.mutate({ id: editingSchool.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const schools = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Schools Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add School
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="no-data">No schools found</td>
                    </tr>
                  ) : (
                    schools.map((school: any) => (
                      <tr key={school.id}>
                        <td>{school.name}</td>
                        <td>{school.email}</td>
                        <td>{school.phone}</td>
                        <td>{school.address}</td>
                        <td>{school.domain || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${school.status || 'pending'}`}>
                            {school.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(school)}>
                              Edit
                            </button>
                            {school.status !== 'approved' && (
                              <button
                                className="btn-approve"
                                onClick={() => approveMutation.mutate(school.id)}
                              >
                                Approve
                              </button>
                            )}
                            {school.status !== 'suspended' && (
                              <button
                                className="btn-suspend"
                                onClick={() => suspendMutation.mutate(school.id)}
                              >
                                Suspend
                              </button>
                            )}
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
              <h3>{editingSchool ? 'Edit School' : 'Add New School'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>School Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
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
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Domain (e.g., schoolname.easyschool.com)</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="schoolname.easyschool.com"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingSchool ? 'Update' : 'Create'}
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
