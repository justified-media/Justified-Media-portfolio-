// app/sitemap.js
import { getStates, getLGAsByState } from '@some19ice/nigeria-geo-core';

export default async function sitemap() {
  const baseUrl = 'https://justifiedmedia.ng';
  const states = getStates();
  
  const urls = [];
  
  // Homepage
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Other key pages
  const extraPaths = ['web-design', 'admin', 'admin/login'];
  for (const path of extraPaths) {
    urls.push({
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }
  
  // State pages
  for (const stateObj of states) {
    urls.push({
      url: `${baseUrl}/${stateObj.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    
    // City pages
    const lgas = getLGAsByState(stateObj.id);
    for (const city of lgas) {
      const cityName = typeof city === 'string' ? city : city.name || city;
      const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        url: `${baseUrl}/${stateObj.id}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }
 
  return urls;
}