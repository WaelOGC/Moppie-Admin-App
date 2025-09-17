import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAdd, 
  MdWork, 
  MdAnalytics,
  MdArrowForward
} from 'react-icons/md';

const QuickActions = ({ actions }) => {
  const getIcon = (iconName) => {
    const icons = {
      MdAdd,
      MdWork,
      MdAnalytics
    };
    return icons[iconName] || MdAdd;
  };

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">Quick Actions</h3>
        <p className="quick-actions-subtitle">Common tasks and shortcuts</p>
      </div>
      
      <div className="quick-actions-list">
        {actions && actions.map((action, index) => {
          const Icon = getIcon(action.icon);
          
          return (
            <Link
              key={action.id}
              to={action.href}
              className="quick-action-item"
              style={{
                animationDelay: `${index * 0.1}s`,
                '--action-color': action.color
              }}
            >
              <div className="quick-action-icon">
                <Icon />
              </div>
              
              <div className="quick-action-content">
                <div className="quick-action-title">
                  {action.title}
                </div>
                <div className="quick-action-description">
                  {action.description}
                </div>
              </div>
              
              <div className="quick-action-arrow">
                <MdArrowForward />
              </div>
              
              <div className="quick-action-ripple"></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
