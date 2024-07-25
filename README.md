# Blogging API

This is a RESTful API for a blogging platform. The API allows users to register, login, create posts, edit posts, delete posts, and comment on posts. The API also includes JWT authentication for secure access to protected routes.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/blogging-api.git
   cd blogging-api
Install the dependencies:

bash
Copy code
npm install
Set up your environment variables by creating a .env file in the root directory with the following content:

plaintext
Copy code
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
Start the server:

bash
Copy code
npm start
The server should now be running on http://localhost:4000.

API Endpoints
User Routes
Register: POST /api/v1/user/register

Body:
json
Copy code
{
  "email": "example@example.com",
  "password": "yourpassword",
  "username": "yourusername"
}
Login: POST /api/v1/user/login

Body:
json
Copy code
{
  "username": "yourusername",
  "password": "yourpassword"
}
Logout: DELETE /api/v1/user/logout

Post Routes
Get All Posts: GET /api/v1/post
Get Single Post: GET /api/v1/post/:id
Create Post: POST /api/v1/post
Body (form-data):
content: "Post content"
title: "Post title"
tags: "tag1, tag2"
author: "author name"
image: <file>
Update Post: PUT /api/v1/post/:id
Body (form-data):
content: "Updated content"
title: "Updated title"
tags: "updatedTag1, updatedTag2"
author: "updated author"
image: <file>
Delete Post: DELETE /api/v1/post/:id
Comment Routes
Post Comment: POST /api/v1/comment/:postId

Body:
json
Copy code
{
  "comment": "your comment"
}
Edit Comment: PUT /api/v1/comment/:id

Body:
json
Copy code
{
  "comment": "updated comment"
}
Delete Comment: DELETE /api/v1/comment/:id

Error Handling
All endpoints return appropriate HTTP status codes and error messages in case of errors.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Node.js
Express.js
MongoDB
Cloudinary
