import { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const announcements = [
  '✨ Complimentary Express Shipping on All Orders Across India',
  '💎 100% Certified 925 Hallmarked Sterling Silver',
  '🎁 Free Luxury Gift Packaging Included with Every Order',
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar" id="announcement-bar">
      <div className="container announcement-bar__inner">
        <p className="announcement-bar__text">{announcements[currentIndex]}</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
