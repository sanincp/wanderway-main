(() => {
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const loadDestination = async () => {
    try {
      const response = await fetch(new URL('destinations.json', window.location.href));
      if (!response.ok) throw new Error(`Destination data request failed: ${response.status}`);
      const destinations = await response.json();
      const requestedId = new URLSearchParams(window.location.search).get('place') || 'tokyo';
      const destination = destinations[requestedId] || destinations.tokyo;
      if (!destination) return;

      document.title = `${destination.title} | Wanderway Tours & Travels LLP`;
      setText('#destinationPageTitle', destination.title);
      setText('#destinationBreadcrumbTitle', destination.title);
      setText('#destinationOverviewTitle', destination.overviewHeading);
      setText('#destinationOverviewParagraph1', destination.overview[0]);
      setText('#destinationOverviewParagraph2', destination.overview[1]);
      setText('#destinationFeaturesTitle', destination.featureHeading);

      const breadcrumb = document.querySelector('.breadcrumb-section');
      if (breadcrumb && destination.images.hero[0]) {
        breadcrumb.style.backgroundImage = `url("${destination.images.hero[0].src}")`;
      }

      document.querySelectorAll('[data-destination-hero]').forEach((image, index) => {
        const item = destination.images.hero[index];
        if (!item) return;
        image.src = item.src;
        image.alt = item.alt;
      });
      document.querySelectorAll('[data-destination-support]').forEach((image, index) => {
        const item = destination.images.supporting[index];
        if (!item) return;
        image.src = item.src;
        image.alt = item.alt;
      });

      const featureList = document.querySelector('#destinationFeaturesList');
      if (featureList) {
        const icon = featureList.querySelector('svg');
        featureList.replaceChildren();
        destination.features.forEach((feature) => {
          const item = document.createElement('li');
          if (icon) item.append(icon.cloneNode(true));
          item.append(document.createTextNode(feature));
          featureList.append(item);
        });
      }
    } catch (error) {
      console.error('Unable to load destination content.', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDestination, { once: true });
  } else {
    loadDestination();
  }
})();
