import React from 'react';
import { 
  MdCalendarToday, 
  MdPayment, 
  MdStar, 
  MdWork, 
  MdPeople,
  MdMoreVert
} from 'react-icons/md';

const ActivityFeed = ({ activities }) => {
  const getIcon = (iconName) => {
    const icons = {
      MdCalendarToday,
      MdPayment,
      MdStar,
      MdWork,
      MdPeople
    };
    return icons[iconName] || MdCalendarToday;
  };

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <h3 className="activity-feed-title">Recent Activity</h3>
        <button className="activity-feed-more" title="View all activities">
          <MdMoreVert />
        </button>
      </div>
      
      <div className="activity-feed-list">
        {activities && activities.map((activity, index) => {
          const Icon = getIcon(activity.icon);
          
          return (
            <div
              key={activity.id}
              className="activity-item"
              style={{
                animationDelay: `${index * 0.1}s`,
                '--activity-color': activity.color
              }}
            >
              <div className="activity-icon">
                <Icon />
              </div>
              
              <div className="activity-content">
                <div className="activity-text">
                  {activity.text}
                </div>
                <div className="activity-time">
                  {activity.time}
                </div>
              </div>
              
              <div className="activity-indicator"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
