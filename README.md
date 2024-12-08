# Fruity 🍏

**Fruity** is a web application featuring a simple fruit image recognition model powered by a neural network. The app provides nutritional information for recognized fruits, along with random fruit facts. The user can also contribute by adding new fruit facts through the website interface.

Built with **Quart** (an asynchronous Python web framework), this application integrates requests to fetch fruit information and share interesting facts about them.

## Features

-   **Fruit Image Recognition**: Upload an image of a fruit and receive nutritional information (calories, carbs, protein, fat). Supported fruits: apple, banana, cherry, chickoo, grapes, kiwi, mango, orange, strawberry.
-   **Random Fruit Facts**: Get random, fun facts about fruits.
-   **Add Your Own Facts**: Easily add new fruit facts directly through the web interface. Try getting facts again and you might be see the ones you added!
-   **Backend Powered by Quart**: Lightweight Python backend using Quart to handle asynchronous requests efficiently.

## Screenshots

![Fruit Recognition App 1](https://github.com/user-attachments/assets/50f17c79-5633-488f-9c5b-919b00114a7a)
![Fruit Recognition App 2](https://github.com/user-attachments/assets/a2e36428-5e0a-4070-8ce2-748015701d1a)
![Fruit Recognition App 3](https://github.com/user-attachments/assets/c6c5295b-9f17-4d55-b6fb-c0b5c7b2cd1e)

---

## Getting Started

To run the Fruity application locally, follow these steps to set up the environment and start the server.

### Prerequisites

Ensure that you have **Poetry** installed on your machine to manage dependencies.

### Steps to Run

Clone the Repository

Begin by cloning the repository to your local machine with a shallow clone (to avoid fetching the entire Git history):

```bash
    git clone --depth 1 https://github.com/vougioukakis/fruity.git
```

Navigate to the Project Directory

Move into the fruit-img-rec directory where the server code resides:

```bash
    cd fruity/fruit-img-rec
```

Install Dependencies

Use Poetry to install the required dependencies:

```bash
    poetry install
```

Run the Server

Once the dependencies are installed, run the Quart server:

```bash
    poetry run python server.py
```

The server will now be running locally, and you can access the app via your web browser at http://localhost:5005.

### Technologies Used

    Quart (Python framework): For building the asynchronous server.
    Poetry: For managing project dependencies.
    PyTorch: For the fruit image recognition model.
    HTML/CSS: For the frontend user interface.
