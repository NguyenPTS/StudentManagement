import React from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import teacherService from '../../../../services/teacherService';
import { Teacher } from '../../../../types/teacher';
import dayjs from 'dayjs';

// ... existing code ... 