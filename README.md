
# Pic2Poem - Transform Your Photos into Poetry 📸✒️

Welcome to Pic2Poem, an innovative application that brings your images to life through the art of poetry! Upload your favorite photos, choose a poetic style, and let our AI-powered engine craft unique verses inspired by your visual memories.

## ✨ Features

-   **Image-to-Poem Generation**: Upload any image and watch as it's transformed into a beautiful poem.
-   **Multiple Poetic Styles**: Choose from a variety of styles including Haiku, Free Verse, Sonnet, Limerick, and more.
-   **AI-Powered Creativity**: Leverages advanced AI (powered by Genkit and Google's Gemini model) to analyze images and generate contextually relevant poetry.
-   **Interactive UI**: A user-friendly interface built with Next.js and ShadCN UI components for a seamless experience.
-   **Share & Save**: Easily share your generated poems or save them along with your image.
-   **Responsive Design**: Enjoy Pic2Poem on any device, thanks to its responsive layout.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation & Running Locally

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project. You may need to add API keys or other configuration if you're extending the Genkit functionality, for example, a `GOOGLE_API_KEY` for the Google AI provider.
    ```env
    # Example .env file content
    # GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the development server for Next.js (frontend):**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will typically start the app on `http://localhost:9002`.

5.  **(Optional) Run the Genkit development server (for AI flows):**
    If you are actively developing or debugging Genkit flows, you might want to run the Genkit watcher:
    ```bash
    npm run genkit:watch
    # or
    # yarn genkit:watch
    ```
    This usually starts the Genkit developer UI on `http://localhost:4000`.

Now you can open your browser and navigate to `http://localhost:9002` to see the application in action!

## 🛠️ Tech Stack

-   **Frontend**: Next.js (with App Router), React, TypeScript
-   **Styling**: Tailwind CSS, ShadCN UI
-   **AI**: Genkit, Google AI (Gemini models)
-   **Deployment**: Configured for Firebase App Hosting (see `apphosting.yaml`)

## 🎨 How to Use

1.  **Upload an Image**: Click on the upload area or drag and drop your desired image.
2.  **Choose a Style**: Select your preferred poetic style from the dropdown menu.
3.  **Generate**: Click the "Generate Poem" button.
4.  **View & Enjoy**: Your poem will appear alongside your image.
5.  **Share or Save**: Use the buttons to share your creation or download the poem and image.

---

Happy poem crafting!
