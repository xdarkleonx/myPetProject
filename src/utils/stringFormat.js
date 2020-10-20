export const upperCaseFirst = text => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const getPhotoPath = (url, substring) => {
  return url && url
    .substring(url.indexOf(substring), url.indexOf('?alt'))
    .replace('%2F', '/');
}