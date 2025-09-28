'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface Institution {
  id: string;
  name: string;
  type: string;
  affiliatedBoard: string;
  email: string;
  phone: string;
  website: string;
  yearOfEstablishment: string;
  totalStudentStrength: number;
  proofOfInstitutionUrl: string;
  profilePhotoUrl?: string;
  address: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
  addedById: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  institution: Institution | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const authCookie = Cookies.get('auth');
    
    if (authCookie) {
      try {
        const parsedAuth = JSON.parse(authCookie);
        const { user, token } = parsedAuth;
        
        if (user && token) {
          // Convert user data to institution format for compatibility
          const institutionData: Institution = {
            id: user.id || user._id || '',
            name: user.institutionName || user.name || 'Institution',
            type: user.type || 'Educational',
            affiliatedBoard: user.affiliatedBoard || '',
            email: user.email || '',
            phone: user.phone || '',
            website: user.website || '',
            yearOfEstablishment: user.yearOfEstablishment || '',
            totalStudentStrength: user.totalStudentStrength || 0,
            proofOfInstitutionUrl: user.proofOfInstitutionUrl || '',
            profilePhotoUrl: user.profilePhotoUrl,
            address: user.address || '',
            approvalStatus: user.approvalStatus || 'approved',
            createdAt: user.createdAt || '',
            updatedAt: user.updatedAt || '',
            addedById: user.addedById || '',
          };
          
          setInstitution(institutionData);
          setIsAuthenticated(true);
        }
      } catch {
        // Invalid data, clear cookies
        Cookies.remove('auth');
        Cookies.remove('auth-token');
        Cookies.remove('institution-data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/institution-admin/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, institution: institutionData } = response.data.data;
        
        // Store in both formats for compatibility
        const authData = {
          token,
          user: institutionData
        };
        
        Cookies.set('auth', JSON.stringify(authData), { expires: 7 }); // Main auth cookie
        Cookies.set('auth-token', token, { expires: 7 }); // Token only
        Cookies.set('institution-data', JSON.stringify(institutionData), { expires: 7 }); // Institution data
        
        setInstitution(institutionData);
        setIsAuthenticated(true);
        
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Login failed. Please try again.';
      return { 
        success: false, 
        message: errorMessage || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    console.log('=== LOGOUT PROCESS STARTED ===');
    console.log('Current isAuthenticated:', isAuthenticated);
    console.log('Current institution:', institution);
    
    console.log('Removing cookies...');
    
    // Get all cookies before removal for debugging
    console.log('Cookies before removal:', {
      auth: Cookies.get('auth'),
      authToken: Cookies.get('auth-token'),
      institutionData: Cookies.get('institution-data')
    });
    
    // Remove cookies with different path options to ensure they're cleared
    Cookies.remove('auth', { path: '' });
    Cookies.remove('auth', { path: '/' });
    Cookies.remove('auth-token', { path: '' });
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('institution-data', { path: '' });
    Cookies.remove('institution-data', { path: '/' });
    
    // Also clear any other potential auth-related cookies
    Cookies.remove('auth');
    Cookies.remove('auth-token');
    Cookies.remove('institution-data');
    
    // Check cookies after removal
    console.log('Cookies after removal:', {
      auth: Cookies.get('auth'),
      authToken: Cookies.get('auth-token'),
      institutionData: Cookies.get('institution-data')
    });
    
    console.log('Setting state...');
    setInstitution(null);
    setIsAuthenticated(false);
    
    console.log('=== LOGOUT PROCESS COMPLETED ===');
    console.log('New isAuthenticated:', false);
    console.log('New institution:', null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        institution,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
