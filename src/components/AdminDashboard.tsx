import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, Shield, Eye, UserX, Crown, Database, Download, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Database as DatabaseType } from '../types/database';

type Profile = DatabaseType['public']['Tables']['profiles']['Row'];
type Contact = DatabaseType['public']['Tables']['contacts']['Row'];
type Event = DatabaseType['public']['Tables']['events']['Row'];
type Achievement = DatabaseType['public']['Tables']['achievements']['Row'];

interface UserStats {
  profile: Profile;
  contactCount: number;
  eventCount: number;
  achievementCount: number;
  lastActivity: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [userDetails, setUserDetails] = useState<{
    contacts: Contact[];
    events: Event[];
    achievements: Achievement[];
  } | null>(null);

  useEffect(() => {
    if (isAdmin && supabase) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  const fetchAllUsers = async () => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch stats for each user
      const userStats: UserStats[] = [];
      
      for (const profile of profiles || []) {
        // Get contact count
        const { count: contactCount } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Get event count
        const { count: eventCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Get achievement count
        const { count: achievementCount } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Get last activity from streak data
        const { data: streakData } = await supabase
          .from('streak_data')
          .select('last_activity_date')
          .eq('user_id', profile.id)
          .single();

        userStats.push({
          profile,
          contactCount: contactCount || 0,
          eventCount: eventCount || 0,
          achievementCount: achievementCount || 0,
          lastActivity: streakData?.last_activity_date || 'Never'
        });
      }

      setUsers(userStats);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const [contactsRes, eventsRes, achievementsRes] = await Promise.all([
        supabase.from('contacts').select('*').eq('user_id', userId),
        supabase.from('events').select('*').eq('user_id', userId),
        supabase.from('achievements').select('*').eq('user_id', userId)
      ]);

      setUserDetails({
        contacts: contactsRes.data || [],
        events: eventsRes.data || [],
        achievements: achievementsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: 'user' | 'admin') => {
    if (!supabase) return;
    
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) {
        setUsers(prev => prev.map(user => 
          user.profile.id === userId 
            ? { ...user, profile: { ...user.profile, role: newRole } }
            : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!supabase) return;
    
    if (!window.confirm(`Delete user ${userEmail}? This action cannot be undone.`)) return;

    try {
      // Delete from auth.users (this will cascade delete all related data)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (!error) {
        setUsers(prev => prev.filter(user => user.profile.id !== userId));
        if (selectedUser?.profile.id === userId) {
          setSelectedUser(null);
          setUserDetails(null);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const exportAllData = async () => {
    if (!supabase) return;
    
    try {
      const allData = {
        users: users.map(u => u.profile),
        contacts: [],
        events: [],
        achievements: [],
        exportDate: new Date().toISOString()
      };

      // Fetch all data for all users
      for (const user of users) {
        const [contactsRes, eventsRes, achievementsRes] = await Promise.all([
          supabase.from('contacts').select('*').eq('user_id', user.profile.id),
          supabase.from('events').select('*').eq('user_id', user.profile.id),
          supabase.from('achievements').select('*').eq('user_id', user.profile.id)
        ]);

        allData.contacts.push(...(contactsRes.data || []));
        allData.events.push(...(eventsRes.data || []));
        allData.achievements.push(...(achievementsRes.data || []));
      }

      const jsonContent = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `networkmaster-admin-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (!isAdmin || !supabase) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">
          {!supabase ? 'Please connect your Supabase project to access admin features.' : 'You don\'t have admin privileges to view this page.'}
        </p>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalContacts = users.reduce((sum, user) => sum + user.contactCount, 0);
  const totalEvents = users.reduce((sum, user) => sum + user.eventCount, 0);
  const activeUsers = users.filter(user => user.lastActivity !== 'Never').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users and view platform analytics</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchAllUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportAllData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export All Data</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
              <p className="text-sm text-gray-600">Total Contacts</p>
            </div>
            <Database className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.profile.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.profile.id === user.profile.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedUser(user);
                    fetchUserDetails(user.profile.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.profile.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{user.profile.full_name}</h4>
                          {user.profile.role === 'admin' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.profile.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.contactCount} contacts</p>
                      <p className="text-xs text-gray-500">Last: {user.lastActivity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-4 text-xs text-gray-600">
                      <span>{user.eventCount} events</span>
                      <span>{user.achievementCount} achievements</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserRole(user.profile.id, user.profile.role);
                        }}
                        className={`px-2 py-1 text-xs rounded ${
                          user.profile.role === 'admin'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.profile.role}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUser(user.profile.id, user.profile.email);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <UserX className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
          
          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.profile.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xl font-semibold text-gray-900">{selectedUser.profile.full_name}</h4>
                    {selectedUser.profile.role === 'admin' && (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-gray-600">{selectedUser.profile.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(selectedUser.profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedUser.contactCount}</p>
                  <p className="text-sm text-blue-700">Contacts</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.eventCount}</p>
                  <p className="text-sm text-green-700">Events</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedUser.achievementCount}</p>
                  <p className="text-sm text-purple-700">Achievements</p>
                </div>
              </div>

              {userDetails && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Recent Contacts</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userDetails.contacts.slice(0, 5).map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">{contact.name}</span>
                          <span className="text-gray-500">{contact.company}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Upcoming Events</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userDetails.events
                        .filter(event => new Date(event.event_date) >= new Date())
                        .slice(0, 3)
                        .map((event) => (
                        <div key={event.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">{event.title}</span>
                          <span className="text-gray-500">{event.event_date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;