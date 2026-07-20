import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Legal.css';

const Legal = () => {
  const { policyType } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [policyType]);

  const policies = {
    terms: {
      title: 'Terms & Conditions',
      content: (
        <>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3>1. Introduction</h3>
          <p>Welcome to Kalrav Jewels. By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h3>2. Products & Pricing</h3>
          <p>All prices are shown in INR (₹). We reserve the right to modify prices without prior notice. Every effort is made to accurately display the colors and details of our 925 sterling silver jewelry, though variations may occur based on your monitor.</p>
          
          <h3>3. Payments</h3>
          <p>We use secure UPI protocols as our secure payment gateway. By proceeding with a purchase, you agree to their terms of processing. We do not store any credit card information on our servers.</p>
          
          <h3>4. User Accounts</h3>
          <p>To place an order, you may need to register an account. You are responsible for maintaining the confidentiality of your account password.</p>

          <h3>5. Contact Information</h3>
          <p>For any questions regarding these terms, please contact us at info@kalravjewels.com or +91 95370 68100.</p>
        </>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3>1. Information We Collect</h3>
          <p>We collect personal information that you provide to us when registering, placing an order, or contacting us. This includes your name, email address, phone number, and shipping address.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use your information to process transactions, deliver orders, communicate with you about updates or offers, and improve our website's user experience.</p>
          
          <h3>3. Data Protection</h3>
          <p>Your privacy is important to us. We implement a variety of security measures to maintain the safety of your personal information when you place an order.</p>

          <h3>4. Third-Party Services</h3>
          <p>We do not sell or trade your personal identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, such as secure payment processors, so long as those parties agree to keep this information confidential.</p>
        </>
      )
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      content: (
        <>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3>1. Cancellations</h3>
          <p>Orders can only be cancelled before they are dispatched. If you wish to cancel an order, please contact us immediately via WhatsApp or email. Once dispatched, the order cannot be cancelled.</p>
          
          <h3>2. Returns & Refunds</h3>
          <p>We accept returns within 7 days of delivery only if the product is defective, damaged during transit, or incorrect. To be eligible for a return, your item must be unused and in the same condition that you received it, including original packaging and tags.</p>
          
          <h3>3. Processing Refunds</h3>
          <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and credited back to your original method of payment (via UPI or bank transfer) within 5-7 business days.</p>
        </>
      )
    },
    shipping: {
      title: 'Shipping Policy',
      content: (
        <>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3>1. Processing Time</h3>
          <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays.</p>
          
          <h3>2. Shipping Rates & Delivery Estimates</h3>
          <p>We offer standard shipping across India. Delivery typically takes 3-7 business days depending on your location. Shipping charges for your order will be calculated and displayed at checkout.</p>
          
          <h3>3. Shipment Confirmation & Tracking</h3>
          <p>You will receive a Shipment Confirmation email/SMS once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h3>4. Damages</h3>
          <p>Kalrav Jewel is not liable for any products damaged or lost during shipping. However, if you received your order damaged, please contact us immediately with unboxing videos/photos so we can assist you.</p>
        </>
      )
    }
  };

  const currentPolicy = policies[policyType] || policies.terms;

  return (
    <div className="legal-page">
      <div className="container">
        <h1 className="legal-title">{currentPolicy.title}</h1>
        <div className="legal-content">
          {currentPolicy.content}
        </div>
      </div>
    </div>
  );
};

export default Legal;
