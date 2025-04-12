import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import StudentList from '../pages/student/StudentList';
import StudentForm from '../pages/student/StudentForm';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/register';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: '/students',
    element: <PrivateRoute><StudentList /></PrivateRoute>,
  },
  {
    path: '/student/add',
    element: <PrivateRoute><StudentForm /></PrivateRoute>,
  },
  {
    path: '/student/:id',
    element: <PrivateRoute><StudentForm /></PrivateRoute>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]); 