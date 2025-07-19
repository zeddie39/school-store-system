
import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthStatusProps {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ loading, error, success }) => {
  if (loading) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Processing your request...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.includes('Database error') 
            ? 'There seems to be a temporary issue with our database. Please try again in a moment.'
            : error
          }
        </AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          {success}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default AuthStatus;
