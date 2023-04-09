const navigateToUrl = async (url, options) => await fetch(url, options);

const apiCall = async (url, options) => await fetch(url, options);

export { navigateToUrl, apiCall };
