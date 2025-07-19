
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DatabaseStatusProps {
  isError?: boolean;
  onRetry?: () => void;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ isError, onRetry }) => {
  if (!isError) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Database Connection Issue</AlertTitle>
      <AlertDescription className="mt-2">
        We're experiencing some temporary issues with our database. 
        This may affect account creation and some features.
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 ml-0"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseStatus;
