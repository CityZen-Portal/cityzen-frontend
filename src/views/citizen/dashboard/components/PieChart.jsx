import React from "react";

// Custom Pie Chart Component
const PieChart = ({ data, title, size = 200 }) => {
  const total = data.data.reduce((sum, value) => sum + value, 0);
  let cumulativeAngle = 0;
  
  const segments = data.data.map((value, index) => {
    const angle = (value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
    const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const pathData = [
      `M 50 50`,
      `L ${startX} ${startY}`,
      `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      'Z'
    ].join(' ');
    
    return {
      path: pathData,
      color: data.colors[index],
      value,
      label: data.labels[index],
      percentage: Math.round((value / total) * 100)
    };
  });

  return (
    <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:-translate-y-1">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
        {title}
      </h3>
      
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            ))}
          </svg>
        </div>
        
        <div className="space-y-3 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {segment.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 dark:text-white font-bold">
                  {segment.value}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  ({segment.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Static data
const genderData = {
  labels: ['Male', 'Female', 'Other'],
  data: [55, 40, 5],
  colors: ['#3B82F6', '#8B5CF6', '#06B6D4']
};

const complaintsData = {
  labels: ['Sanitation', 'Water', 'Electricity', 'Roads'],
  data: [30, 20, 25, 25],
  colors: ['#EF4444', '#F59E0B', '#10B981', '#6366F1']
};

const servicesData = {
  labels: ['Permits', 'Grievances', 'Updates'],
  data: [45, 35, 20],
  colors: ['#EC4899', '#14B8A6', '#F97316']
};

const PieChartCard = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <PieChart data={genderData} title="Gender Distribution" />
      <PieChart data={complaintsData} title="Complaints Raised by Citizens" />
      <PieChart data={servicesData} title="Services Closed by Staff" />
    </div>
  );
};

export default PieChartCard;