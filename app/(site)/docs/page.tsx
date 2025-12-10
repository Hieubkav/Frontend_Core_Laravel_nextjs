'use client';

import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  admin?: boolean;
  params?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  body?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: {
    status: number;
    description: string;
    example: any;
  }[];
}

const endpoints: Endpoint[] = [
  // Auth endpoints
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Đăng nhập với email và password',
    auth: false,
    body: [
      { name: 'email', type: 'string', required: true, description: 'Email người dùng' },
      { name: 'password', type: 'string', required: true, description: 'Mật khẩu' },
    ],
    response: [
      {
        status: 200,
        description: 'Đăng nhập thành công',
        example: {
          success: true,
          message: 'Login successfully',
          data: {
            user: { id: 1, email: 'user@example.com', name: 'John Doe' },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      {
        status: 401,
        description: 'Email hoặc password không đúng',
        example: {
          success: false,
          message: 'Invalid credentials',
          errors: { email: ['The provided credentials are invalid.'] },
        },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    description: 'Lấy thông tin người dùng hiện tại',
    auth: true,
    response: [
      {
        status: 200,
        description: 'Lấy thông tin thành công',
        example: {
          success: true,
          message: 'User retrieved',
          data: { id: 1, email: 'user@example.com', name: 'John Doe' },
        },
      },
    ],
  },
  {
    method: 'PUT',
    path: '/api/v1/auth/profile',
    description: 'Cập nhật thông tin profile',
    auth: true,
    body: [
      { name: 'name', type: 'string', required: false, description: 'Tên người dùng' },
      { name: 'email', type: 'string', required: false, description: 'Email' },
    ],
    response: [
      {
        status: 200,
        description: 'Cập nhật thành công',
        example: {
          success: true,
          message: 'Profile updated successfully',
          data: { id: 1, email: 'newemail@example.com', name: 'New Name' },
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/auth/change-password',
    description: 'Thay đổi mật khẩu',
    auth: true,
    body: [
      { name: 'current_password', type: 'string', required: true, description: 'Mật khẩu hiện tại' },
      { name: 'new_password', type: 'string', required: true, description: 'Mật khẩu mới' },
      { name: 'new_password_confirmation', type: 'string', required: true, description: 'Xác nhận mật khẩu mới' },
    ],
    response: [
      {
        status: 200,
        description: 'Thay đổi mật khẩu thành công',
        example: { success: true, message: 'Password changed successfully' },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/auth/logout',
    description: 'Đăng xuất',
    auth: true,
    response: [
      {
        status: 200,
        description: 'Đăng xuất thành công',
        example: { success: true, message: 'Logged out successfully' },
      },
    ],
  },

  // User endpoints (admin only)
  {
    method: 'GET',
    path: '/api/v1/users',
    description: 'Lấy danh sách người dùng',
    auth: true,
    admin: true,
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Trang hiển thị (mặc định: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Số bản ghi trên trang (mặc định: 15)' },
    ],
    response: [
      {
        status: 200,
        description: 'Lấy danh sách thành công',
        example: {
          success: true,
          message: 'Users retrieved',
          data: [
            { id: 1, email: 'user@example.com', name: 'John Doe' },
            { id: 2, email: 'user2@example.com', name: 'Jane Doe' },
          ],
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/users',
    description: 'Tạo người dùng mới',
    auth: true,
    admin: true,
    body: [
      { name: 'email', type: 'string', required: true, description: 'Email' },
      { name: 'name', type: 'string', required: true, description: 'Tên người dùng' },
      { name: 'password', type: 'string', required: true, description: 'Mật khẩu' },
    ],
    response: [
      {
        status: 201,
        description: 'Tạo thành công',
        example: {
          success: true,
          message: 'User created successfully',
          data: { id: 3, email: 'newuser@example.com', name: 'New User' },
        },
      },
    ],
  },

  // Posts endpoints (admin only)
  {
    method: 'GET',
    path: '/api/v1/posts',
    description: 'Lấy danh sách bài viết',
    auth: true,
    admin: true,
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Trang hiển thị (mặc định: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Số bản ghi trên trang (mặc định: 15)' },
    ],
    response: [
      {
        status: 200,
        description: 'Lấy danh sách thành công',
        example: {
          success: true,
          message: 'Posts retrieved successfully',
          data: [
            { id: 1, title: 'Post 1', slug: 'post-1', content: 'Content...' },
            { id: 2, title: 'Post 2', slug: 'post-2', content: 'Content...' },
          ],
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/posts',
    description: 'Tạo bài viết mới',
    auth: true,
    admin: true,
    body: [
      { name: 'title', type: 'string', required: true, description: 'Tiêu đề bài viết' },
      { name: 'slug', type: 'string', required: true, description: 'Slug (URL friendly)' },
      { name: 'content', type: 'text', required: true, description: 'Nội dung bài viết' },
    ],
    response: [
      {
        status: 201,
        description: 'Tạo thành công',
        example: {
          success: true,
          message: 'Post created successfully',
          data: { id: 3, title: 'New Post', slug: 'new-post', content: 'Content...' },
        },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/posts/{id}',
    description: 'Lấy chi tiết bài viết',
    auth: true,
    admin: true,
    params: [
      { name: 'id', type: 'integer', required: true, description: 'ID bài viết' },
    ],
    response: [
      {
        status: 200,
        description: 'Lấy chi tiết thành công',
        example: {
          success: true,
          message: 'Post retrieved successfully',
          data: { id: 1, title: 'Post 1', slug: 'post-1', content: 'Content...' },
        },
      },
    ],
  },
  {
    method: 'PUT',
    path: '/api/v1/posts/{id}',
    description: 'Cập nhật bài viết',
    auth: true,
    admin: true,
    body: [
      { name: 'title', type: 'string', required: false, description: 'Tiêu đề bài viết' },
      { name: 'slug', type: 'string', required: false, description: 'Slug (URL friendly)' },
      { name: 'content', type: 'text', required: false, description: 'Nội dung bài viết' },
    ],
    response: [
      {
        status: 200,
        description: 'Cập nhật thành công',
        example: {
          success: true,
          message: 'Post updated successfully',
          data: { id: 1, title: 'Updated Post', slug: 'post-1', content: 'Content...' },
        },
      },
    ],
  },
  {
    method: 'DELETE',
    path: '/api/v1/posts/{id}',
    description: 'Xóa bài viết',
    auth: true,
    admin: true,
    params: [
      { name: 'id', type: 'integer', required: true, description: 'ID bài viết' },
    ],
    response: [
      {
        status: 200,
        description: 'Xóa thành công',
        example: {
          success: true,
          message: 'Post deleted successfully',
        },
      },
    ],
  },

  // Settings endpoint
  {
    method: 'GET',
    path: '/api/v1/settings',
    description: 'Lấy cài đặt ứng dụng',
    auth: false,
    response: [
      {
        status: 200,
        description: 'Lấy cài đặt thành công',
        example: {
          success: true,
          message: 'Settings retrieved',
          data: { app_name: 'My App', app_url: 'https://example.com' },
        },
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-800',
  POST: 'bg-green-100 text-green-800',
  PUT: 'bg-orange-100 text-orange-800',
  PATCH: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
};

export default function DocsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEndpointId = (endpoint: Endpoint) => {
    return `${endpoint.method}-${endpoint.path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">API Documentation</h1>
          <p className="text-lg text-slate-600">
            Tài liệu API v1 - Tất cả endpoints và cách sử dụng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Overview */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Hướng dẫn nhanh</h2>
          <div className="space-y-4 text-slate-700">
            <p>
              <strong>Base URL:</strong> <code className="bg-slate-100 px-2 py-1 rounded">http://localhost:8000/api/v1</code>
            </p>
            <p>
              <strong>Authentication:</strong> Sử dụng Bearer token trong header <code className="bg-slate-100 px-2 py-1 rounded">Authorization: Bearer {'{token}'}</code>
            </p>
            <p>
              <strong>Content-Type:</strong> <code className="bg-slate-100 px-2 py-1 rounded">application/json</code>
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Endpoints</h2>

          {endpoints.map((endpoint) => {
            const id = getEndpointId(endpoint);
            const isExpanded = expandedId === id;

            return (
              <div
                key={id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(id)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className={`px-3 py-1 rounded font-semibold text-sm ${methodColors[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <code className="flex-1 text-left font-mono text-slate-900">{endpoint.path}</code>
                  <div className="flex items-center gap-2">
                    {endpoint.auth && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded font-medium">
                        Auth
                      </span>
                    )}
                    {endpoint.admin && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">
                        Admin
                      </span>
                    )}
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-2">Mô tả</h4>
                      <p className="text-slate-700">{endpoint.description}</p>
                    </div>

                    {/* Parameters */}
                    {endpoint.params && endpoint.params.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">Query Parameters</h4>
                        <div className="space-y-3">
                          {endpoint.params.map((param) => (
                            <div key={param.name} className="bg-white p-3 rounded border border-slate-200">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="font-mono text-slate-900">{param.name}</code>
                                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                  {param.type}
                                </span>
                                {param.required && <span className="text-red-600 font-bold">*</span>}
                              </div>
                              <p className="text-sm text-slate-600">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    {endpoint.body && endpoint.body.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">Request Body</h4>
                        <div className="space-y-3">
                          {endpoint.body.map((field) => (
                            <div key={field.name} className="bg-white p-3 rounded border border-slate-200">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="font-mono text-slate-900">{field.name}</code>
                                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                  {field.type}
                                </span>
                                {field.required && <span className="text-red-600 font-bold">*</span>}
                              </div>
                              <p className="text-sm text-slate-600">{field.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Response</h4>
                      <div className="space-y-4">
                        {endpoint.response.map((response, idx) => (
                          <div key={idx} className="bg-white p-4 rounded border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded text-sm font-semibold ${
                                  response.status >= 200 && response.status < 300
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {response.status}
                              </span>
                              <p className="text-slate-700">{response.description}</p>
                            </div>

                            {/* Code Example */}
                            <div className="relative bg-slate-900 text-slate-100 p-4 rounded font-mono text-sm overflow-x-auto">
                              <pre>{JSON.stringify(response.example, null, 2)}</pre>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2), `${id}-${idx}`)}
                                className="absolute top-2 right-2 p-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                                title="Copy to clipboard"
                              >
                                {copiedId === `${id}-${idx}` ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-600 text-sm">
          <p>Cần giúp? Liên hệ với team development</p>
        </div>
      </div>
    </div>
  );
}
