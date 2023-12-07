## Docker Setup:

Just run `docker-compose up` from the main directory

## Non-Docker Setup:

### Environment Setup

1. **Install Git**:

   - Ensure you have Git installed. You can install it from [git-scm.com](https://git-scm.com/).

2. **Install Node.js and npm**:
   - You should download and install Node.js and npm (which comes with Node.js) from [nodejs.org](https://nodejs.org/).
   - You can verify the installation by running `node -v` and `npm -v` in your terminal or command prompt.

### Pulling the Project

1. **Clone the Repository**:

   - You need to open the terminal or command prompt, navigate to the directory where you want to store the project, and run:
     ```
     git clone [repo-url](https://github.com/kaden175ck/SENG513)]
     ```

2. **Navigate to the Project Directory**:
   ```
   cd [project-name]
   ```

### Setting Up the Project

1. **Frontend Setup**:

   - Navigate to the frontend directory:
     ```
     cd frontend
     ```
   - Install the necessary packages:
     ```
     npm install
     ```
   - After installation, you can start the React app to make sure everything is working:
     ```
     npm start
     ```

2. **Backend Setup**:

   - Open a new terminal or command prompt window.
   - Navigate to the backend directory (from the root of your project):
     ```
     cd backend
     ```
   - Install the necessary packages:
     ```
     npm install
     ```
   - Start the Express server:
     ```
     npm start
     ```

3. **Supabase Setup**:

   - You should install the Supabase client in both the frontend and backend if needed:
   - `npm install @supabase/supabase-js`.

4. **Install Express**:

   - Navigate to your backend directory and run:

   ```
   npm install express
   ```

### Final Steps

- You should see the frontend React app in your browser and be able to access the backend server at `http://localhost:3001` (or whichever port you have set).
- Remember to pull from the repository regularly to get the latest changes (`git pull origin main`).
