import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceManagement from './component/ServiceManagement';
import StaffManagement from './component/StaffManagement';
import FeedbackAnalytics from './component/FeedbackAnalytics';

const AdminServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainView = location.pathname === '/admin/services';

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 text-gray-900 dark:bg-navy-700">
      {isMainView && (
        <>
          <ServiceManagement onManageClick={() => navigate('/admin/services/manage')} />
          <StaffManagement
            onAddStaffs={() => navigate('/admin/services/staff')}
            onViewTasks={() => navigate('/admin/services/tasks')}
            onViewSchedule={() => navigate('/admin/services/schedule')}
          />
          <FeedbackAnalytics onFeedback={() => navigate('/admin/services/feedback')} />
        </>
      )}
    </div>
  );
};

export default AdminServices;
