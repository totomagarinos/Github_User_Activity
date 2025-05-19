const username = document.getElementById('username');
const app = document.getElementById('app');
const form = document.getElementById('form');
const submitButton = document.getElementById('submit');

// Function to fetch GitHub activity
async function fetchGitHubActivity(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`,
  )

  if (!response.ok) {
    alert(`Error fetching data: ${response.status}`);
    return null;
  }

  return response.json();
}


// Function to display the activity
function displayActivity(events) {

  let newDiv = document.createElement('div');
  newDiv.setAttribute('id', 'data');
  app.appendChild(newDiv);

  events.forEach((event) => {
    let action;
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
        break;
      case "IssuesEvent":
        action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
      case "ForkEvent":
        action = `Forked ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }

    let newP = document.createElement('p');
    newP.textContent = `- ${action}`;
    newDiv.appendChild(newP);
  });
}

// Adding event listener to submit button to fetch and display the activity
submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  let dataDiv = document.getElementById('data')

  if (app.contains(dataDiv)) {
    dataDiv.remove();
  }

  fetchGitHubActivity(username.value)
    .then((events) => {
      if (events) {
        displayActivity(events)
      }
  });
})