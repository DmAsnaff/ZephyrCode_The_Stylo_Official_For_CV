// Helper function to encode slashes as %2F
export const encodeFirebaseUrl = (url: string) => {
    // Split the URL into the base URL and query parameters
    const [baseUrl, queryParams] = url.split('?');
  
    // Encode every slash in the base URL as %2F
    const encodedBaseUrl = baseUrl.split('/').map(encodeURIComponent).join('%2F');
  
    // If query parameters exist, return the recombined URL with the encoded base URL
    if (queryParams) {
      return `${encodedBaseUrl}?${queryParams}`;
    }
  
    // If no query parameters, return the encoded base URL
    return encodedBaseUrl;
  };
  