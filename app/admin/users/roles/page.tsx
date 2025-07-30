'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockPermissions: Permission[] = [
        // Dashboard permissions
        { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to admin dashboard', module: 'Dashboard' },
        
        // User management permissions
        { id: 'users.view', name: 'View Users', description: 'View user list and details', module: 'Users' },
        { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', module: 'Users' },
        { id: 'users.edit', name: 'Edit Users', description: 'Edit user information', module: 'Users' },
        { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts', module: 'Users' },
        { id: 'users.roles', name: 'Manage User Roles', description: 'Assign roles to users', module: 'Users' },
        
        // Product management permissions
        { id: 'products.view', name: 'View Products', description: 'View product catalog', module: 'Products' },
        { id: 'products.create', name: 'Create Products', description: 'Add new products', module: 'Products' },
        { id: 'products.edit', name: 'Edit Products', description: 'Modify product details', module: 'Products' },
        { id: 'products.delete', name: 'Delete Products', description: 'Remove products', module: 'Products' },
        { id: 'products.publish', name: 'Publish Products', description: 'Control product visibility', module: 'Products' },
        
        // Order management permissions
        { id: 'orders.view', name: 'View Orders', description: 'View order list and details', module: 'Orders' },
        { id: 'orders.edit', name: 'Edit Orders', description: 'Modify order information', module: 'Orders' },
        { id: 'orders.status', name: 'Change Order Status', description: 'Update order status', module: 'Orders' },
        { id: 'orders.refund', name: 'Process Refunds', description: 'Handle order refunds', module: 'Orders' },
        
        // Content management permissions
        { id: 'content.view', name: 'View Content', description: 'Access content management', module: 'Content' },
        { id: 'content.edit', name: 'Edit Content', description: 'Modify site content', module: 'Content' },
        { id: 'content.publish', name: 'Publish Content', description: 'Control content visibility', module: 'Content' },
        
        // Analytics permissions
        { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics and reports', module: 'Analytics' },
        { id: 'analytics.export', name: 'Export Analytics', description: 'Export reports and data', module: 'Analytics' },
        
        // System permissions
        { id: 'system.settings', name: 'System Settings', description: 'Access system configuration', module: 'System' },
        { id: 'system.backup', name: 'System Backup', description: 'Manage system backups', module: 'System' },
        { id: 'system.logs', name: 'View System Logs', description: 'Access system logs', module: 'System' }
      ];

      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'Super Admin',
          description: 'Full access to all system functions',
          permissions: mockPermissions.map(p => p.id),
          userCount: 1,
          isDefault: true,
          createdAt: '2023-01-01'
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Administrative access with some restrictions',
          permissions: [
            'dashboard.view',
            'users.view', 'users.create', 'users.edit', 'users.roles',
            'products.view', 'products.create', 'products.edit', 'products.publish',
            'orders.view', 'orders.edit', 'orders.status', 'orders.refund',
            'content.view', 'content.edit', 'content.publish',
            'analytics.view', 'analytics.export'
          ],
          userCount: 3,
          isDefault: true,
          createdAt: '2023-01-01'
        },
        {
          id: '3',
          name: 'Moderator',
          description: 'Limited access to orders and content management',
          permissions: [
            'dashboard.view',
            'users.view',
            'products.view',
            'orders.view', 'orders.edit', 'orders.status',
            'content.view', 'content.edit',
            'analytics.view'
          ],
          userCount: 5,
          isDefault: true,
          createdAt: '2023-01-01'
        },
        {
          id: '4',
          name: 'Customer',
          description: 'Basic customer access',
          permissions: [],
          userCount: 892,
          isDefault: true,
          createdAt: '2023-01-01'
        }
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setLoading(false);
    }, 1000);
  };

  const handleCreateRole = () => {
    if (newRole.name.trim()) {
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
        isDefault: false,
        createdAt: new Date().toISOString()
      };
      
      setRoles([...roles, role]);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowCreateModal(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowCreateModal(true);
  };

  const handleUpdateRole = () => {
    if (editingRole && newRole.name.trim()) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
          : role
      ));
      setEditingRole(null);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowCreateModal(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading roles and permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={false} onClose={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
                <p className="text-gray-600">Manage user roles and permissions</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Create Role
            </button>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                    {role.name}
                  </span>
                  {role.isDefault && (
                    <span className="text-xs text-gray-500">Default</span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Users</span>
                    <span className="text-sm font-medium text-gray-900">{role.userCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Permissions</span>
                    <span className="text-sm font-medium text-gray-900">{role.permissions.length}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    Edit
                  </button>
                  {!role.isDefault && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <i className="ri-delete-bin-line mr-1"></i>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Permissions Overview */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{module}</h3>
                  <div className="space-y-2">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <i className="ri-shield-check-line text-green-600 mt-1 flex-shrink-0"></i>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                    setNewRole({ name: '', description: '', permissions: [] });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter role description"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                      <div key={module} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">{module}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {modulePermissions.map((permission) => (
                            <label key={permission.id} className="flex items-start space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newRole.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                    setNewRole({ name: '', description: '', permissions: [] });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}