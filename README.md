# GitHub Repo Manager

## 🚀 Project Overview

GitHub Repo Manager is a Next.js-based web application that allows users to manage their favs GitHub repositories. The app includes authentication, repository listing, favorites management, and searching functionalities. It supports OAuth authentication with GitHub and also allows users to sign up with email and password.

## 📌 Features

- **User Authentication**: Sign up with email and password or log in with GitHub.
- **GitHub Repository Management**: Fetch and display repositories from a user's GitHub account.
- **Favorite Repositories**: Mark repositories as favorites and store them in a database.
- **Search Functionality**: Search by name through repositories.
- **Next.js SSR**: The application uses server-side rendering (SSR) for better performance.

## 🛠 Installation

### Steps to Install and Run

1. **Install Dependencies**

   ```sh
   npm install  
   ```

   or

   ```sh
   yarn install
   ```

2. **Configure Environment Variables** Create a `.env.local` file in the root directory and add the following variables:

   ```env
   DATABASE_URL="file:./db.sqlite"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

3. **Set Up Database**

   ```sh
   npx prisma migrate dev --name init
   ```

4. **Run the Application**

   ```sh
   npm run dev
   ```

   or

   ```sh
   yarn dev
   ```

   The app will be available at `http://localhost:3000`

## 🏗 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes, Prisma, SQLite
- **Authentication**: NextAuth.js with GitHub OAuth and email/password login
- **API**: GitHub GraphQL API v4

## 📢 Contact

For any questions or contributions, feel free to connect: [**Hernan David Alvarez Caballero**](https://www.linkedin.com/in/hernan-david-alvarez-caballero)

