document.addEventListener('DOMContentLoaded', function() {
  const repoUrl = 'https://api.github.com/repos/amitkumar010715/CP/contents';

  fetch(repoUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const container = document.getElementById('snippets-container');
      let openSnippet = null;

      data.forEach(file => {
        if (file.type === 'file' && (file.name.endsWith('.cpp') || file.name.endsWith('.py') || file.name.endsWith('.c++'))) {
          const snippetDiv = document.createElement('div');
          snippetDiv.className = 'snippet';
          snippetDiv.innerHTML = `<strong>${file.name}</strong>`;
          snippetDiv.file = file; // Store file information in snippetDiv

          snippetDiv.addEventListener('click', () => {
            if (openSnippet === snippetDiv) {
              snippetDiv.innerHTML = `<strong>${file.name}</strong>`;
              snippetDiv.style.color = 'red'; // Reset text color
              openSnippet = null;
            } else {
              if (openSnippet) {
                openSnippet.innerHTML = `<strong>${openSnippet.file.name}</strong>`;
                openSnippet.style.color = 'red'; // Reset text color
              }
              fetch(file.download_url)
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.text();
                })
                .then(snippet => {
                  snippetDiv.innerHTML = `<strong>${file.name}</strong><br><pre>${snippet}</pre>`;
                  snippetDiv.style.color = 'black'; // Change text color when open
                  openSnippet = snippetDiv;
                })
                .catch(error => {
                  console.error('Error fetching file content:', error);
                  snippetDiv.innerHTML = `<strong>${file.name}</strong><br><pre>Error fetching content</pre>`;
                });
            }
          });

          container.appendChild(snippetDiv);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching GitHub API:', error);
      // Handle errors here (e.g., display error message)
    });
});
