# 🕵️ Missing Complaint Registration Web Application

## 📖 Overview
This web application allows users to **register missing items**, browse complaints posted by others, and track lost items. It provides an efficient way for users to find their lost possessions, with a dedicated **admin panel** to oversee complaints and manage the status of recovered items.

## ✨ Features
- 🌐 **User Authentication**: New users can **sign up** and **log in** securely using the platform.
- 📄 **Register Missing Items**: Users can file missing item complaints, providing details and uploading a picture of the item.
- 🔍 **Browse Missing Complaints**: Users can view missing complaints posted by others.
- 🔧 **Admin Panel**: Admins have full control over complaints, with the ability to monitor and delete complaints when items are found.
- 🖼️ **Image Upload**: Users can upload an image of the missing item using **Multer** for easy recognition.
- 🔒 **Session Management**: User sessions are handled using **express-session** for secure and efficient session handling.

## 💻 Tech Stack
This application is built using a modern web development stack to ensure scalability, performance, and security:

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap for responsive design
  - EJS for dynamic templating

- **Backend**:
  - Node.js with Express.js
  - MySQL for database management
  - Multer for image uploads
  - Express-session for session handling

## 📦 Key Dependencies
- **Node.js**: Runtime environment for executing JavaScript on the server side.
- **Express.js**: Web framework for building RESTful APIs and handling routes.
- **MySQL**: Relational database to store user details, complaints, and admin data.
- **Multer**: Middleware for handling multipart form data (for image uploads).
- **express-session**: Session management middleware for maintaining user sessions.

## 🛠️ Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/missing-complaints-app.git
   cd missing-complaints-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   - Create a **MySQL** database.
   - Run the provided SQL scripts in `database.sql` to create the necessary tables.
   - Update the MySQL connection credentials in the project.

4. **Run the Application**:
   ```bash
   node app.js
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## ⚙️ Admin Panel
The admin can:
- View all complaints.
- Delete complaints when an item is found.

Admin login credentials should be stored in the database (can be added directly via MySQL).

## 🎯 Use Cases
- A user has lost an item and wants to register a missing complaint.
- A user finds someone else's lost item and wants to browse missing complaints to return it.
- Admin wants to manage the complaints and delete entries for found items.

## 🛡️ Security
- **Password Encryption**: Implemented for securing user credentials.
- **Session Handling**: Ensures secure login/logout and session tracking for authenticated users.

## 👥 Contributing
We welcome contributions! Please fork this repository and create a pull request for review. Make sure to include detailed commit messages explaining your changes.
