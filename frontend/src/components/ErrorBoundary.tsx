import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Oops! Something went wrong';
  let message = 'An unexpected error occurred. Please try again later.';
  let status = '500';

  if (isRouteErrorResponse(error)) {
    status = error.status.toString();
    switch (error.status) {
      case 404:
        title = 'Page Not Found';
        message = 'The page you are looking for does not exist.';
        break;
      case 401:
        title = 'Unauthorized';
        message = 'You need to be logged in to access this page.';
        break;
      case 403:
        title = 'Forbidden';
        message = 'You do not have permission to access this page.';
        break;
      default:
        if (error.data?.message) {
          message = error.data.message;
        }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Result
        status={status as any}
        title={title}
        subTitle={message}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Go Home
          </Button>,
          <Button key="back" onClick={() => navigate(-1)}>
            Go Back
          </Button>,
        ]}
        className="dark:bg-gray-800 dark:text-white p-8 rounded-lg"
      />
    </div>
  );
};

export default ErrorBoundary; 