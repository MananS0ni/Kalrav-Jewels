const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send order received email to the customer.
 * @param {Object} order - The saved order document
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 */
const sendOrderReceived = async (order, customerEmail, customerName) => {
  try {
    // Build the items table rows

    // Build the items table rows
    const itemRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:12px 16px; border-bottom:1px solid #f0e8d5; font-family:'Georgia',serif; color:#2c2c2c; font-size:14px;">
            ${item.name}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #f0e8d5; text-align:center; color:#6b6b6b; font-size:14px;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #f0e8d5; text-align:right; color:#2c2c2c; font-size:14px; font-weight:600;">
            ₹${(item.price * item.quantity).toLocaleString('en-IN')}
          </td>
        </tr>`
      )
      .join('');

    const { shippingAddress: addr } = order;
    const addressStr = `${addr.addressLine}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
    const paymentLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid via UPI';
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#faf8f4; font-family:'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border:1px solid #e8dfc8;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a; padding:36px; text-align:center;">
              <img src="https://kalravjewels.com/kalrav_icon.png" alt="Kalrav Jewels Logo" style="height:45px; margin-bottom:12px; object-fit:contain;" />
              <h1 style="margin:8px 0 0; font-family:'Georgia',serif; font-size:32px; font-weight:400; color:#ffffff; letter-spacing:2px;">KALRAV JEWELS</h1>
              <div style="width:40px; height:1px; background:#c9a84c; margin:12px auto 0;"></div>
            </td>
          </tr>

          <!-- Gold strip -->
          <tr>
            <td style="background:#c9a84c; padding:12px 36px; text-align:center;">
              <p style="margin:0; font-size:11px; letter-spacing:3px; color:#ffffff; text-transform:uppercase; font-weight:600;">Order Received</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 36px 24px;">
              <p style="margin:0; font-size:22px; font-family:'Georgia',serif; color:#1a1a1a; font-weight:400;">Dear ${customerName},</p>
              <p style="margin:12px 0 0; font-size:14px; color:#6b6b6b; line-height:1.8;">
                Thank you for your purchase. We have received your order and it is currently pending confirmation. 
                We take great pride in every piece we craft, and yours is no exception. We will notify you once it is confirmed.
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4; border:1px solid #e8dfc8; border-left:3px solid #c9a84c;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:10px; letter-spacing:2px; color:#c9a84c; text-transform:uppercase;">Order Reference</p>
                    <p style="margin:4px 0 0; font-size:20px; font-family:'Georgia',serif; color:#1a1a1a; font-weight:600;">#KJ-${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:0 36px 24px;">
              <p style="margin:0 0 12px; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase;">Your Items</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8dfc8;">
                <tr style="background:#faf8f4;">
                  <th style="padding:12px 16px; text-align:left; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase; font-weight:600; border-bottom:1px solid #e8dfc8;">Item</th>
                  <th style="padding:12px 16px; text-align:center; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase; font-weight:600; border-bottom:1px solid #e8dfc8;">Qty</th>
                  <th style="padding:12px 16px; text-align:right; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase; font-weight:600; border-bottom:1px solid #e8dfc8;">Price</th>
                </tr>
                ${itemRows}
                <tr style="background:#faf8f4;">
                  <td colspan="2" style="padding:14px 16px; font-size:12px; letter-spacing:1px; color:#9a9a9a; text-transform:uppercase; font-weight:600;">Total</td>
                  <td style="padding:14px 16px; text-align:right; font-size:18px; font-family:'Georgia',serif; color:#1a1a1a; font-weight:600;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping + Payment -->
          <tr>
            <td style="padding:0 36px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top; padding-right:10px;">
                    <p style="margin:0 0 8px; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase;">Shipping To</p>
                    <p style="margin:0; font-size:13px; color:#2c2c2c; line-height:1.7;">${addr.fullName}<br>${addressStr}<br>${addr.phone}</p>
                  </td>
                  <td width="50%" style="vertical-align:top; padding-left:10px;">
                    <p style="margin:0 0 8px; font-size:10px; letter-spacing:2px; color:#9a9a9a; text-transform:uppercase;">Payment</p>
                    <p style="margin:0; font-size:13px; color:#2c2c2c; line-height:1.7;">${paymentLabel}<br>Shipping: <span style="color:#2c2c2c; font-weight:600;">₹${order.shippingCost}</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Assurances -->
          <tr>
            <td style="padding:0 36px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 14px; font-size:10px; letter-spacing:3px; color:#c9a84c; text-transform:uppercase;">Our Promise to You</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px; color:rgba(255,255,255,0.7); padding:4px 0;">✦ &nbsp; BIS Hallmarked Jewellery</td>
                        <td style="font-size:12px; color:rgba(255,255,255,0.7); padding:4px 0;">✦ &nbsp; Pan-India Delivery</td>
                      </tr>
                      <tr>
                        <td style="font-size:12px; color:rgba(255,255,255,0.7); padding:4px 0;">✦ &nbsp; Lifetime Maintenance</td>
                        <td style="font-size:12px; color:rgba(255,255,255,0.7); padding:4px 0;">✦ &nbsp; Easy Exchange Policy</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:0 36px 40px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#6b6b6b; line-height:1.8;">
                Questions about your order? We're here to help.<br>
                <a href="tel:+919537068100" style="color:#c9a84c; text-decoration:none; font-weight:600;">+91 95370 68100</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@kalravjewels.com" style="color:#c9a84c; text-decoration:none; font-weight:600;">info@kalravjewels.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf8f4; border-top:1px solid #e8dfc8; padding:20px 36px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#b0b0b0; letter-spacing:1px;">© ${new Date().getFullYear()} Kalrav Jewels · Handcrafted with love</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: 'Kalrav Jewels <noreply@kalravjewels.com>',
      to: customerEmail,
      subject: `Order Received — #KJ-${orderId} | Kalrav Jewels`,
      html: htmlBody,
    });

    console.log(`✓ Order received email sent to ${customerEmail}`);
  } catch (err) {
    // Don't fail the order if email fails — just log it
    console.error('✗ Failed to send confirmation email:', err.message);
  }
};

/**
 * Send order status update email to the customer.
 * @param {Object} order - The saved order document
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's name
 * @param {string} status - The new order status
 */
const sendOrderStatusUpdate = async (order, customerEmail, customerName, status) => {
  try {
    const orderId = order._id.toString().slice(-8).toUpperCase();
    
    // Status formatting
    const statusMap = {
      confirmed: { title: 'Order Confirmed', msg: 'Your order has been confirmed and is now being processed for dispatch.', color: '#c9a84c' },
      processing: { title: 'Order Processing', msg: 'Your order is currently being handcrafted and prepared for you.', color: '#2c2c2c' },
      shipped: { title: 'Order Shipped', msg: 'Great news! Your order has been shipped and is on its way to you.', color: '#2c2c2c' },
      delivered: { title: 'Order Delivered', msg: 'Your order has been delivered. We hope you love your new jewellery!', color: '#2c2c2c' },
      cancelled: { title: 'Order Cancelled', msg: 'Your order has been cancelled. If you have any questions, please contact us.', color: '#d9534f' }
    };

    const statusInfo = statusMap[status];
    if (!statusInfo) return; // Don't send for unknown or 'pending' status here

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#faf8f4; font-family:'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border:1px solid #e8dfc8;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a; padding:36px; text-align:center;">
              <img src="https://kalravjewels.com/kalrav_icon.png" alt="Kalrav Jewels Logo" style="height:45px; margin-bottom:12px; object-fit:contain;" />
              <h1 style="margin:8px 0 0; font-family:'Georgia',serif; font-size:32px; font-weight:400; color:#ffffff; letter-spacing:2px;">KALRAV JEWELS</h1>
            </td>
          </tr>

          <!-- Status strip -->
          <tr>
            <td style="background:${statusInfo.color}; padding:12px 36px; text-align:center;">
              <p style="margin:0; font-size:11px; letter-spacing:3px; color:#ffffff; text-transform:uppercase; font-weight:600;">${statusInfo.title}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 36px 24px;">
              <p style="margin:0; font-size:22px; font-family:'Georgia',serif; color:#1a1a1a; font-weight:400;">Dear ${customerName},</p>
              <p style="margin:12px 0 0; font-size:14px; color:#6b6b6b; line-height:1.8;">
                ${statusInfo.msg}
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding:0 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4; border:1px solid #e8dfc8; border-left:3px solid #c9a84c;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:10px; letter-spacing:2px; color:#c9a84c; text-transform:uppercase;">Order Reference</p>
                    <p style="margin:4px 0 0; font-size:20px; font-family:'Georgia',serif; color:#1a1a1a; font-weight:600;">#KJ-${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:0 36px 40px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#6b6b6b; line-height:1.8;">
                Questions about your order? We're here to help.<br>
                <a href="tel:+919537068100" style="color:#c9a84c; text-decoration:none; font-weight:600;">+91 95370 68100</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@kalravjewels.com" style="color:#c9a84c; text-decoration:none; font-weight:600;">info@kalravjewels.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf8f4; border-top:1px solid #e8dfc8; padding:20px 36px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#b0b0b0; letter-spacing:1px;">© ${new Date().getFullYear()} Kalrav Jewels · Handcrafted with love</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: 'Kalrav Jewels <noreply@kalravjewels.com>',
      to: customerEmail,
      subject: `${statusInfo.title} — #KJ-${orderId} | Kalrav Jewels`,
      html: htmlBody,
    });

    console.log(`✓ Order status email (${status}) sent to ${customerEmail}`);
  } catch (err) {
    console.error('✗ Failed to send status email:', err.message);
  }
};

module.exports = { sendOrderReceived, sendOrderStatusUpdate };
