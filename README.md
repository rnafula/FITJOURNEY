# FitJourney

FitJourney is a web application designed to help users track and manage their fitness journey. It provides user registration, login, and personalized dashboards to support fitness goals. It has four accounts for the MVP ; fitness instructor, nutritionist, regular user and the admin

## Technologies Used

- CSS
- HTML
- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- MySQL
- bcrypt (for password hashing)
- express-session (for session management)
- cors (Cross-Origin Resource Sharing)

## Features

- A Landing page for users who are not logged in
- User signup with secure password hashing
- User login with session management
- Personalized user dashboard
  - Admin dashboard for managing users and accounts
  - Fitness instructor dashboard for creating workout plans,( managing client sessions and progress-this feature will be developed later)
  - Nutritionist dashboard for creating meal plans ( and managing client progress -this feature will be developed later)
  - General user dashboard for tracking progress and accessing workout and meal plans
- Responsive UI with EJS templates and CSS styling
- User authentication and authorization with bcrypt and express-session

## User Roles and Capabilities

- Admin:
  - Can manage all users, accounts, and dashboards
- Fitness Instructor:
  - Can create workout plans
  - manage client sessions and progress
  - have a general user account
- Nutritionist:
  - Can create meal plans
  - manage client progress
  - have a general user account
- General User:
  - Can view their dashboard
  - view and pick workout and meal plans

## Project Structure

- `index.js` - Main application file with routes and server setup.
- `views/` - EJS templates for rendering pages.
- `public/` - Static assets like CSS and images.
- `fitjourney.sql` - SQL file to set up the MySQL database schema.

## Installation

1. Clone the repository to your local machine.
2. Ensure you have Node.js and MySQL installed.
3. Create a MySQL database named `fitjourney_db`.
4. Import the `fitjourney.sql` file to set up the database schema.
5. Install dependencies by running:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node index.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```
3. Use the signup page to create a new account.
4. Login to access your personalized dashboard.

## License

This project is a proprietary software (closed source) .

## UI SCREENSHOTS

![Dashboard Screenshot](/UI%20Screenshots/Landing%20page.png)
![Dashboard Screenshot](/UI%20Screenshots/login%20form.png)
![Dashboard Screenshot](/UI%20Screenshots/chosen%20meal%20plans.png)
![Dashboard Screenshot](/UI%20Screenshots/Instructor's%20dashboard.png)
![Dashboard Screenshot](/UI%20Screenshots/Meal%20plans.png)
![Dashboard Screenshot](/UI%20Screenshots/Nutritionist%20dashboard.png)
![Dashboard Screenshot](/UI%20Screenshots/Registeration%20form.png)
![Dashboard Screenshot](/UI%20Screenshots/mobile_chosen%20meal%20plans.png)
![Dashboard Screenshot](/UI%20Screenshots/mobile_landing%20page.png)
![Dashboard Screenshot](/UI%20Screenshots/mobile_meal%20plans.png)
![Dashboard Screenshot](/UI%20Screenshots/mobile_navbar.png)
![Dashboard Screenshot](/UI%20Screenshots/mobile_regular%20user%20dashboard.png)
