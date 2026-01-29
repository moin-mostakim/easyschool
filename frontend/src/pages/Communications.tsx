import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { communicationAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import './CRUD.css';

export default function Communications() {
  const { showSuccess, showError } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState<'notices' | 'messages'>('notices');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'NOTICE',
  });

  const queryClient = useQueryClient();

  const { data: noticesData, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices', page, limit],
    queryFn: () => communicationAPI.getNotices({ page, limit }),
    enabled: activeTab === 'notices',
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', page, limit],
    queryFn: () => communicationAPI.getMessages({ page, limit }),
    enabled: activeTab === 'messages',
  });

  const createNoticeMutation = useMutation({
    mutationFn: communicationAPI.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setShowModal(false);
      resetForm();
      showSuccess('Notice created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create notice';
      showError(errorMessage);
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: communicationAPI.createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setShowModal(false);
      resetForm();
      showSuccess('Message sent successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to send message';
      showError(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'NOTICE',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'notices') {
      createNoticeMutation.mutate(formData);
    } else {
      createMessageMutation.mutate(formData);
    }
  };

  const notices = noticesData?.data?.data || noticesData?.data || [];
  const messages = messagesData?.data?.data || messagesData?.data || [];
  const totalPages = activeTab === 'notices'
    ? (noticesData?.data?.totalPages || noticesData?.totalPages || 1)
    : (messagesData?.data?.totalPages || messagesData?.totalPages || 1);
  const totalItems = activeTab === 'notices'
    ? (noticesData?.data?.total || noticesData?.total || 0)
    : (messagesData?.data?.total || messagesData?.total || 0);

  const isLoading = activeTab === 'notices' ? noticesLoading : messagesLoading;
  const items = activeTab === 'notices' ? notices : messages;

  return (
    <Layout>
      <div className="crud-container">
        <div className="crud-header">
          <h2>Communications</h2>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Create {activeTab === 'notices' ? 'Notice' : 'Message'}
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            Notices
          </button>
          <button
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
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
                    <th>Title</th>
                    <th>Content</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="no-data">
                        No {activeTab} found
                      </td>
                    </tr>
                  ) : (
                    items.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.content?.substring(0, 100)}...</td>
                        <td>{item.createdAt?.split('T')[0] || 'N/A'}</td>
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
              <h3>Create {activeTab === 'notices' ? 'Notice' : 'Message'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #ecf0f1;
        }
        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #7f8c8d;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }
        .tab:hover {
          color: #3498db;
        }
        .tab.active {
          color: #3498db;
          border-bottom-color: #3498db;
          font-weight: 600;
        }
      `}</style>
    </Layout>
  );
}
