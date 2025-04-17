import React from 'react';
import { 
  Modal, 
  Tabs, 
  Descriptions, 
  Tag, 
  Table
} from 'antd';
import { Class, ClassStatistics } from '../../types/class';
import { GradeDistributionChart } from '../charts/GradeDistributionChart';

const { TabPane } = Tabs;

interface ClassPreviewProps {
  class: Class;
  visible: boolean;
  onClose: () => void;
  statistics: ClassStatistics;
}

const ClassPreview: React.FC<ClassPreviewProps> = ({ 
  class: classData, 
  visible, 
  onClose, 
  statistics 
}) => {
  return (
    <Modal
      title="Chi tiết lớp học"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Tabs defaultActiveKey="info">
        <TabPane tab="Thông tin chung" key="info">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên lớp">{classData.name}</Descriptions.Item>
            <Descriptions.Item label="Mã lớp">{classData.code}</Descriptions.Item>
            <Descriptions.Item label="Môn học">{classData.subject}</Descriptions.Item>
            <Descriptions.Item label="Năm học">{classData.academicYear}</Descriptions.Item>
            <Descriptions.Item label="Học kỳ">{classData.semester}</Descriptions.Item>
            <Descriptions.Item label="Giáo viên">
              {classData.teacher?.name || 'Chưa phân công'}
            </Descriptions.Item>
            <Descriptions.Item label="Sĩ số">
              {classData.studentCount}/{classData.maxStudents}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={
                classData.status === 'active' ? 'green' : 
                classData.status === 'completed' ? 'blue' : 
                'red'
              }>
                {classData.status === 'active' ? 'Đang học' :
                 classData.status === 'completed' ? 'Đã kết thúc' :
                 'Đã hủy'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Lịch học" key="schedule">
          <Table
            dataSource={classData.schedule}
            columns={[
              {
                title: 'Thứ',
                dataIndex: 'dayOfWeek',
                render: (day) => `Thứ ${day + 1}`,
              },
              {
                title: 'Bắt đầu',
                dataIndex: 'startTime',
              },
              {
                title: 'Kết thúc',
                dataIndex: 'endTime',
              },
              {
                title: 'Phòng',
                dataIndex: 'room',
              },
            ]}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Thống kê" key="statistics">
          <GradeDistributionChart statistics={statistics} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ClassPreview; 