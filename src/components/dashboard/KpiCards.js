import React from 'react';
import { 
  MdCalendarToday, 
  MdWork, 
  MdPeople, 
  MdPayment,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md';

const KpiCards = ({ data }) => {
  const getIcon = (iconName) => {
    const icons = {
      MdCalendarToday,
      MdWork,
      MdPeople,
      MdPayment
    };
    return icons[iconName] || MdCalendarToday;
  };

  const getTrendIcon = (trendUp) => {
    return trendUp ? MdTrendingUp : MdTrendingDown;
  };

  return (
    <div className="kpi-cards-grid">
      {data && data.map((card, index) => {
        const Icon = getIcon(card.icon);
        const TrendIcon = getTrendIcon(card.trendUp);
        
        return (
          <div
            key={card.id}
            className="kpi-card"
            style={{
              animationDelay: `${index * 0.1}s`,
              '--card-color': card.color
            }}
          >
            {/* Card Header */}
            <div className="kpi-card-header">
              <div className="kpi-card-icon">
                <Icon />
              </div>
              <div className="kpi-card-trend">
                <TrendIcon className={`trend-icon ${card.trendUp ? 'trend-up' : 'trend-down'}`} />
                <span className={`trend-text ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="kpi-card-content">
              <div className="kpi-card-value">
                {card.value}
              </div>
              <div className="kpi-card-title">
                {card.title}
              </div>
              <div className="kpi-card-subtitle">
                {card.subtitle}
              </div>
            </div>

            {/* Card Glow Effect */}
            <div className="kpi-card-glow" style={{ '--glow-color': card.color }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
