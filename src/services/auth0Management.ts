import { auth0Config } from '../config/auth0';
import { createClient } from '@supabase/supabase-js';

// Supabase client for Edge Functions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  logins_count: number;
  app_metadata?: any;
  user_metadata?: any;
  blocked?: boolean;
}

interface ManagementAPIConfig {
  domain: string;
  clientId: string;
  clientSecret?: string; // NEVER put this in frontend code
  scope: string;
  audience: string;
}

export class Auth0ManagementService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: { domain: string }) {}

  // This would typically be done on the backend
  private async getManagementToken(): Promise<string> {
    // In a real app, this should be a call to YOUR backend API
    // which then calls Auth0's Management API
    throw new Error(
      'Management API calls should be proxied through your backend. ' +
      'Direct calls from frontend are not secure.'
    );
  }

  // Get users via Supabase Edge Function
  async getUsers(page = 0, perPage = 50): Promise<Auth0User[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');

      const { data, error } = await supabase.functions.invoke('auth0-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { page, per_page: perPage },
      });

      if (error) throw error;
      console.log('Fetched Auth0 users:', data);

      // Auth0 returns users array directly or in a 'users' property with pagination
      return data.users || data || [];
    } catch (error) {
      console.error('Error fetching Auth0 users:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async getUser(userId: string): Promise<Auth0User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');

      const { data, error } = await supabase.functions.invoke(`auth0-users/${userId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUser(userId: string, data: Partial<Auth0User>): Promise<Auth0User> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    const { data: result, error } = await supabase.functions.invoke(`auth0-users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: data,
    });

    if (error) throw error;
    return result;
  }

  async deleteUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    const { error } = await supabase.functions.invoke(`auth0-users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
  }

  async blockUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    const { error } = await supabase.functions.invoke(`auth0-users/${userId}/block`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
  }

  async unblockUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    const { error } = await supabase.functions.invoke(`auth0-users/${userId}/unblock`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
  }

  // Convert Auth0 user to your app's User format
  static mapAuth0UserToAppUser(auth0User: Auth0User): any {
    // Use the same role detection logic as AuthContext
    const roles: string[] = [];

    // Check user_metadata.role
    if (auth0User.user_metadata?.role) {
      const metaRole = auth0User.user_metadata.role;
      if (metaRole === 'administrator' || metaRole === 'admin' || metaRole === 'Admin') {
        if (!roles.includes('administrator')) roles.push('administrator');
      } else {
        if (!roles.includes('provider-relations-coordinator')) roles.push('provider-relations-coordinator');
      }
    }

    // Check user_metadata.roles array
    if (auth0User.user_metadata?.roles && Array.isArray(auth0User.user_metadata.roles)) {
      auth0User.user_metadata.roles.forEach((role: string) => {
        if ((role === 'administrator' || role === 'admin' || role === 'Admin') && !roles.includes('administrator')) {
          roles.push('administrator');
        } else if (!roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    }

    // Check app_metadata.authorization.roles
    if (auth0User.app_metadata?.authorization?.roles && Array.isArray(auth0User.app_metadata.authorization.roles)) {
      auth0User.app_metadata.authorization.roles.forEach((role: string) => {
        if (role === 'superadminudb' || role === 'administrator' || role === 'Admin') {
          if (!roles.includes('administrator')) roles.push('administrator');
        } else if ((role === 'user' || role === 'User') && !roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        } else if (role === 'provider-relations-coordinator' && !roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    }

    // Check app_metadata.roles
    else if (auth0User.app_metadata?.roles) {
      auth0User.app_metadata.roles.forEach((role: string) => {
        if ((role === 'administrator' || role === 'Admin') && !roles.includes('administrator')) {
          roles.push('administrator');
        } else if (!roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    }

    // Check app_metadata.role (single role)
    else if (auth0User.app_metadata?.role) {
      const appRole = auth0User.app_metadata.role;
      if (appRole === 'administrator' && !roles.includes('administrator')) {
        roles.push('administrator');
      } else if (!roles.includes('provider-relations-coordinator')) {
        roles.push('provider-relations-coordinator');
      }
    }

    // Check synced custom claims in app_metadata.custom_claims
    if (auth0User.app_metadata?.custom_claims) {
      const customRoles = auth0User.app_metadata.custom_claims.roles || [];
      const customRole = auth0User.app_metadata.custom_claims.role;

      // Process custom roles array
      customRoles.forEach((role) => {
        if (role === 'Admin' || role === 'administrator') {
          if (!roles.includes('administrator')) roles.push('administrator');
        } else if (role === 'provider-relations-coordinator' || role === 'User') {
          if (!roles.includes('provider-relations-coordinator')) roles.push('provider-relations-coordinator');
        }
      });

      // Process single custom role
      if (customRole) {
        if (customRole === 'Admin' || customRole === 'administrator') {
          if (!roles.includes('administrator')) roles.push('administrator');
        } else if (customRole === 'provider-relations-coordinator' || customRole === 'User') {
          if (!roles.includes('provider-relations-coordinator')) roles.push('provider-relations-coordinator');
        }
      }
    }

    // Show all detected roles or note about custom claims
    let displayRole = 'Custom Claims Only';
    if (roles.length > 0) {
      displayRole = roles.join(', ');
    } else if (auth0User.app_metadata?.authorization?.roles?.length === 1 && auth0User.app_metadata.authorization.roles[0] === '') {
      // Empty string indicates roles are stored in custom claims
      displayRole = 'Custom Claims Only';
    } else if (auth0User.app_metadata?.authorization?.roles?.length === 0) {
      displayRole = 'No Role';
    }

    console.log('Extracted roles:', roles);
    console.log('Display role:', displayRole);

    return {
      id: auth0User.user_id,
      firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || 'Unknown',
      lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || 'User',
      email: auth0User.email || '',
      role: displayRole, // Show all roles or "No Role"
      roles: roles, // Store the actual roles array
      status: auth0User.blocked ? 'suspended' : 'active',
      lastLogin: auth0User.last_login || '',
      createdAt: auth0User.created_at,
      isEmailVerified: auth0User.email_verified || false,
      phone: auth0User.user_metadata?.phone || undefined,
      department: auth0User.user_metadata?.department || undefined,
      providersManaged: auth0User.user_metadata?.providersManaged || 0,
      lastActivity: auth0User.last_login || auth0User.updated_at || '',
      assignedSpecialties: auth0User.user_metadata?.assignedSpecialties || undefined
    };
  }
}

// Singleton instance
export const auth0Management = new Auth0ManagementService({
  domain: auth0Config.domain
});

// Example backend API endpoint structure (implement in your backend):
/*
// Backend API endpoints needed:
// GET /api/auth0/users - List all users
// GET /api/auth0/users/:id - Get specific user
// PATCH /api/auth0/users/:id - Update user
// DELETE /api/auth0/users/:id - Delete user
// POST /api/auth0/users/:id/block - Block user
// POST /api/auth0/users/:id/unblock - Unblock user

// Backend implementation example (Node.js/Express):
const ManagementClient = require('auth0').ManagementClient;

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  scope: 'read:users update:users delete:users'
});

app.get('/api/auth0/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await management.getUsers({
      page: req.query.page || 0,
      per_page: req.query.per_page || 50
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/