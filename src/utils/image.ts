/**
 * Transforms a raw Google Cloud Storage URL into a usable Firebase Storage URL.
 *
 * Example:
 * Input: https://storage.googleapis.com/bucket-name/path/to/image.png
 * Output: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Fto%2Fimage.png?alt=media
 */
export const getSafeImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // Check if it's a raw GCS URL
  // Format: https://storage.googleapis.com/[bucket]/[object]
  const gcsRegex = /^https:\/\/storage\.googleapis\.com\/([^/]+)\/(.+)$/;
  const match = url.match(gcsRegex);

  if (match) {
    const [, bucket, path] = match;
    // Encode the path to handle slashes and special characters correctly in the Firebase URL structure
    const encodedPath = encodeURIComponent(path);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
  }

  return url;
};
