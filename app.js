const cardContainer = document.querySelector(".card-container");

// Number of todo items to fetch per scroll event
const todosPerFetch = 10;
let currentTodo = 1; // Start from the first todo
let isLoading = false; // Prevent multiple fetches at the same time

// Function to create and add cards dynamically
const createCard = (title) => {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = title;
  cardContainer.appendChild(card);
};

// Function to load more todos
const loadMoreTodos = () => {
  if (isLoading) return; // Prevent multiple fetches at once
  isLoading = true; // Set the loading flag

  // Fetch todos in batches
  for (let i = currentTodo; i < currentTodo + todosPerFetch; i++) {
    const url = `https://jsonplaceholder.typicode.com/todos/${i}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        createCard(data.title); // Use the title from the API
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        createCard("Error loading title"); // Fallback content
      });
  }
  currentTodo += todosPerFetch; // Update the next starting todo

  // Allow new fetches once the current ones are done
  setTimeout(() => {
    isLoading = false;
  }, 500); // Wait for 500ms to reset the loading flag
};

// Intersection Observer logic
const scrollObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When the sentinel is visible, load more todos
        loadMoreTodos();

        // After loading more todos, create a new sentinel
        createNewSentinel();

        // Unobserve the current sentinel to avoid infinite triggering
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: cardContainer, // Observe within card-container
    rootMargin: "200px", // Trigger when 200px of sentinel is visible
    threshold: 1.0, // Trigger when sentinel is fully visible
  }
);

// Function to create and append a new sentinel
const createNewSentinel = () => {
  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  cardContainer.appendChild(sentinel);

  // Start observing the new sentinel
  scrollObserver.observe(sentinel);
};

// Initially load the first set of todos and create the first sentinel
loadMoreTodos();
createNewSentinel();
