if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-1FP3Z9BGBV";
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-1FP3Z9BGBV', { send_page_view: false });
}
