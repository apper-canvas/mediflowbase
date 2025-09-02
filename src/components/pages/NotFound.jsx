import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
          <ApperIcon name="FileQuestion" size={64} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <Link to="/">
          <Button>
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;