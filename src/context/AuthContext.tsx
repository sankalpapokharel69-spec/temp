import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../utils/storage';
import { generateSalt, hashPassword, verifyPassword } from '../utils/crypto';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLoginAs: (role: 'admin' | 'customer') => void;
  updateProfile: (name: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Stored mock hashed credentials for offline/local simulation
interface StoredCredential {
  email: string;
  hash: string;
  salt: string;
}

const CREDENTIALS_KEY = 'webcraft_credentials';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('webcraft_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Initialize default credentials if not existing or ensure admin updated
  useEffect(() => {
    const initCredentials = async () => {
      const existing = localStorage.getItem(CREDENTIALS_KEY);
      let creds: Record<string, StoredCredential> = existing ? JSON.parse(existing) : {};

      // Primary Admin: sankalpapokharel69@gmail.com / 1325354430
      const adminEmail = 'sankalpapokharel69@gmail.com';
      if (!creds[adminEmail]) {
        const adminSalt = await generateSalt();
        const adminHash = await hashPassword('1325354430', adminSalt);
        creds[adminEmail] = { email: adminEmail, hash: adminHash, salt: adminSalt };
      }

      // Demo customer: alex@example.com / Customer@123
      if (!creds['alex@example.com']) {
        const customerSalt = await generateSalt();
        const customerHash = await hashPassword('Customer@123', customerSalt);
        creds['alex@example.com'] = { email: 'alex@example.com', hash: customerHash, salt: customerSalt };
      }

      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    };
    initCredentials();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();
    let foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If logging in as primary admin sankalpapokharel69@gmail.com, ensure user exists
    if (!foundUser && cleanEmail === 'sankalpapokharel69@gmail.com') {
      foundUser = {
        id: 'usr_admin_sankalpa',
        name: 'Sankalpa Pokharel',
        email: 'sankalpapokharel69@gmail.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: '2026-01-01T00:00:00Z',
      };
      users.unshift(foundUser);
      StorageService.saveUsers(users);
    }

    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // Direct check for primary admin credential
    if (cleanEmail === 'sankalpapokharel69@gmail.com' && password === '1325354430') {
      foundUser.role = 'admin';
      setUser(foundUser);
      localStorage.setItem('webcraft_current_user', JSON.stringify(foundUser));
      return { success: true };
    }

    const credsStr = localStorage.getItem(CREDENTIALS_KEY);
    const creds: Record<string, StoredCredential> = credsStr ? JSON.parse(credsStr) : {};
    const userCred = creds[cleanEmail];

    if (userCred) {
      const isValid = await verifyPassword(password, userCred.hash, userCred.salt);
      if (!isValid) {
        return { success: false, error: 'Invalid password. Please verify and try again.' };
      }
    }

    // Set user
    setUser(foundUser);
    localStorage.setItem('webcraft_current_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const salt = await generateSalt();
    const hash = await hashPassword(password, salt);

    const credsStr = localStorage.getItem(CREDENTIALS_KEY);
    const creds: Record<string, StoredCredential> = credsStr ? JSON.parse(credsStr) : {};
    creds[cleanEmail] = { email: cleanEmail, hash, salt };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: cleanEmail,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=6366f1`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    StorageService.saveUsers(users);

    setUser(newUser);
    localStorage.setItem('webcraft_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('webcraft_current_user');
  };

  const quickLoginAs = (role: 'admin' | 'customer') => {
    const users = StorageService.getUsers();
    let target = users.find(u => role === 'admin' ? (u.email === 'sankalpapokharel69@gmail.com' || u.role === 'admin') : (u.role === 'customer'));
    if (role === 'admin') {
      if (!target) {
        target = {
          id: 'usr_admin_sankalpa',
          name: 'Sankalpa Pokharel',
          email: 'sankalpapokharel69@gmail.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01T00:00:00Z',
        };
        users.unshift(target);
        StorageService.saveUsers(users);
      }
      target.role = 'admin';
    }
    if (target) {
      setUser(target);
      localStorage.setItem('webcraft_current_user', JSON.stringify(target));
    }
  };

  const updateProfile = (name: string, avatar?: string) => {
    if (!user) return;
    const updated = { ...user, name, ...(avatar ? { avatar } : {}) };
    setUser(updated);
    localStorage.setItem('webcraft_current_user', JSON.stringify(updated));

    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updated;
      StorageService.saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        quickLoginAs,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
