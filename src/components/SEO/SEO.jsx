import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    const defaultTitle = 'Kalrav Jewels — Timeless Fine 925 Sterling Silver Jewellery';
    const siteTitle = title ? `${title} | Kalrav Jewels` : defaultTitle;
    document.title = siteTitle;

    const metaDescription = description || 'Discover Kalrav Jewels — Handcrafted 925 hallmarked sterling silver jewellery, natural gemstone necklaces, rings, earrings, and bespoke creations.';
    const metaKeywords = keywords || '925 sterling silver jewellery, silver jewellery India, hallmarked silver, Kalrav Jewels, silver rings, silver necklaces';
    const metaUrl = url || window.location.href;
    const metaImage = image || 'https://kalravjewels.com/public/hero_jewelry.png';

    // Helper to set meta content
    const setMetaTag = (selector, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    setMetaTag('meta[name="description"]', metaDescription);
    setMetaTag('meta[name="keywords"]', metaKeywords);
    setMetaTag('meta[property="og:title"]', siteTitle);
    setMetaTag('meta[property="og:description"]', metaDescription);
    setMetaTag('meta[property="og:url"]', metaUrl);
    setMetaTag('meta[property="og:image"]', metaImage);
    setMetaTag('meta[name="twitter:title"]', siteTitle);
    setMetaTag('meta[name="twitter:description"]', metaDescription);
    setMetaTag('meta[name="twitter:image"]', metaImage);
  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
