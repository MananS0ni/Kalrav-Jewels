import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phone = '919537068100';
  const defaultMessage = encodeURIComponent('Hello Kalrav Jewels, I have an enquiry regarding fine jewellery.');
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat on WhatsApp with Kalrav Jewels"
      title="Chat with us on WhatsApp (+91 95370 68100)"
      id="whatsapp-float-btn"
    >
      <span className="whatsapp-float-btn__pulse"></span>
      <svg className="whatsapp-float-btn__icon" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 2a13.9 13.9 0 0 0-12 20.8L2.1 29.9l7.3-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.4 1.1 1.2-4.2-.3-.5a11.6 11.6 0 1 1 9.8 5.4zm6.4-8.7c-.3-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2s-.9 1.1-1.1 1.3-.4.3-.7.1a9.2 9.2 0 0 1-2.7-1.7 10.2 10.2 0 0 1-1.9-2.3c-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.4.3-.5.1-.2 0-.4 0-.5s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1.1.5s-1.5 1.5-1.5 3.6 1.5 4.2 1.7 4.5c.2.3 3 4.6 7.3 6.4 1 .4 1.8.7 2.4.9 1 .3 2 .3 2.7.2.8-.1 2.4-1 2.8-1.9.3-1 .3-1.8.2-1.9-.1-.2-.4-.3-.7-.5z"
          fill="currentColor"
        />
      </svg>
      <span className="whatsapp-float-btn__tooltip">Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;
