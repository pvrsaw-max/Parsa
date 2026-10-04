/**
 * Utility to download the packaged project source code ZIP file
 */
export function downloadProjectZip() {
  const link = document.createElement('a');
  link.href = '/modiryar-project.zip';
  link.download = 'modiryar-project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
