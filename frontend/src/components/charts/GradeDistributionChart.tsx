import React from 'react';
import { Card, Progress, Typography } from 'antd';
import { ClassStatistics } from '../../types/class';

const { Title } = Typography;

interface GradeDistributionChartProps {
  statistics: ClassStatistics;
}

const gradeRanges = [
  { label: 'Excellent (9.0-10)', value: 'excellentCount', color: '#52c41a' },
  { label: 'Good (8.0-8.9)', value: 'goodCount', color: '#1890ff' },
  { label: 'Above Average (7.0-7.9)', value: 'aboveAverageCount', color: '#faad14' },
  { label: 'Average (5.0-6.9)', value: 'averageCount', color: '#fa8c16' },
  { label: 'Below Average (<5.0)', value: 'belowAverageCount', color: '#ff4d4f' },
];

export const GradeDistributionChart = ({ statistics }: GradeDistributionChartProps) => {
  const total = statistics.totalStudents;

  return (
    <Card>
      <Title level={4}>Grade Distribution</Title>
      <div className="space-y-4">
        {gradeRanges.map((range) => {
          const count = statistics[range.value as keyof ClassStatistics] as number;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={range.value} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span>{range.label}</span>
                <span>{count} students ({percentage}%)</span>
              </div>
              <Progress 
                percent={percentage} 
                strokeColor={range.color}
                showInfo={false}
                size="small"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}; 