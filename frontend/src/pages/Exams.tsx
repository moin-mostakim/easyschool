import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { examAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './CRUD.css';

export default function Exams() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: '',
    maxMarks: '',
    description: '',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['exams', page, limit],
    queryFn: () => examAPI.getAll({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: examAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setShowModal(false);
      resetForm();
      showSuccess('Exam created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create exam';
      showError(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => examAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setShowModal(false);
      resetForm();
      showSuccess('Exam updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update exam';
      showError(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: examAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      showSuccess('Exam deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete exam';
      showError(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      date: '',
      maxMarks: '',
      description: '',
    });
    setEditingExam(null);
  };

  const handleEdit = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name || '',
      subject: exam.subject || '',
      date: exam.date?.split('T')[0] || '',
      maxMarks: exam.maxMarks?.toString() || '',
      description: exam.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      maxMarks: parseInt(formData.maxMarks),
    };
    if (editingExam) {
      updateMutation.mutate({ id: editingExam.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const exams = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Exams Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Exam
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
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Max Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">No exams found</td>
                    </tr>
                  ) : (
                    exams.map((exam: any) => (
                      <tr key={exam.id}>
                        <td>{exam.name}</td>
                        <td>{exam.subject}</td>
                        <td>{exam.date?.split('T')[0] || 'N/A'}</td>
                        <td>{exam.maxMarks}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(exam)}>
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this exam?')) {
                                  deleteMutation.mutate(exam.id);
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
              <h3>{editingExam ? 'Edit Exam' : 'Add New Exam'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Exam Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
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
                    <label>Max Marks *</label>
                    <input
                      type="number"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingExam ? 'Update' : 'Create'}
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
