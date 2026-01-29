import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { feesAPI, studentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './CRUD.css';

export default function Fees() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    description: '',
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    studentAPI.getAll({ page: 1, limit: 100 }).then((res) => {
      setStudents(res.data?.data || res.data || []);
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['fees', page, limit],
    queryFn: () => feesAPI.getAll({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: feesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      setShowModal(false);
      resetForm();
      showSuccess('Fee structure created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create fee structure';
      showError(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => feesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      setShowModal(false);
      resetForm();
      showSuccess('Fee structure updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update fee structure';
      showError(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: feesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      showSuccess('Fee structure deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete fee structure';
      showError(errorMessage);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => feesAPI.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      setShowPaymentModal(false);
      setPaymentData({ amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'CASH' });
      showSuccess('Payment recorded successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to record payment';
      showError(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      studentId: '',
      amount: '',
      dueDate: '',
      description: '',
    });
    setEditingFee(null);
  };

  const handleEdit = (fee: any) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId || '',
      amount: fee.amount?.toString() || '',
      dueDate: fee.dueDate?.split('T')[0] || '',
      description: fee.description || '',
    });
    setShowModal(true);
  };

  const handlePayment = (fee: any) => {
    setSelectedFee(fee);
    setPaymentData({
      amount: fee.amount?.toString() || '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
    });
    setShowPaymentModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    if (editingFee) {
      updateMutation.mutate({ id: editingFee.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    paymentMutation.mutate({
      id: selectedFee.id,
      data: {
        ...paymentData,
        amount: parseFloat(paymentData.amount),
      },
    });
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'N/A';
  };

  const fees = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const totalItems = data?.data?.total || data?.total || 0;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Fees Management</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Fee
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
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-data">No fees records found</td>
                    </tr>
                  ) : (
                    fees.map((fee: any) => (
                      <tr key={fee.id}>
                        <td>{getStudentName(fee.studentId)}</td>
                        <td>${fee.amount}</td>
                        <td>{fee.dueDate?.split('T')[0] || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${fee.status?.toLowerCase() || 'pending'}`}>
                            {fee.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(fee)}>
                              Edit
                            </button>
                            <button className="btn-approve" onClick={() => handlePayment(fee)}>
                              Record Payment
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this fee?')) {
                                  deleteMutation.mutate(fee.id);
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
              <h3>{editingFee ? 'Edit Fee' : 'Add New Fee'}</h3>
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
                    <label>Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date *</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                    {editingFee ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Record Payment</h3>
              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Date *</label>
                    <input
                      type="date"
                      value={paymentData.paymentDate}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                      required
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Record Payment
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
