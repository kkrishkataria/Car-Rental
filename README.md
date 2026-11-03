# 🚗 CarRental - Full-Stack Car Rental Platform

A modern, full-stack car rental web application built with **React, Vite, Tailwind CSS, Node.js, Express, and MongoDB**. The platform allows customers to search, filter, and book rental vehicles across different cities, while providing car owners with a dashboard to list vehicles, define availability spans, manage bookings, and track monthly revenue.

---

## 🌟 Key Features

### 👤 Customer Experience
* **Available Cars & Real-Time Search**: Search vehicles across brand, model, seating capacity (e.g. 5 seats, 7-seater), category, transmission, fuel type, location, and year.
* **Multi-Criteria Sorting**: Sort vehicles on-the-fly:
  * **Model / Make**: A–Z and Z–A
  * **Dates / Year**: Newest first, oldest first, and earliest availability date
  * **Seating Capacity**: Most to least, least to most
  * **Pricing**: Low to high, high to low
* **Date & Location Availability Check**: Query available cars by pickup/return dates and pickup city.
* **Interactive Booking**: Reserve vehicles with dynamic daily cost calculation and booking status tracking.
* **Customer Authentication**: Secure JWT-based registration and login.

### 💼 Owner Management Dashboard
* **Fleet Analytics**: Monitor total cars, active bookings, pending approvals, confirmed bookings, and monthly revenue in real time.
* **List New Cars**:
  * Upload high-resolution car images automatically optimized and served via **ImageKit CDN**.
  * Set vehicle specs: Brand, Model, Year, Category (SUV, Sedan, Hatchback, Van, Coupe), Transmission, Fuel Type, Seating Capacity, Daily Rate, Location, and Description.
  * **Availability Window (Date Span)**: Define custom `Available From` and `Available Until` dates during which the car is bookable.
* **Manage Listings**: View current listings and toggle availability or remove vehicles.
* **Booking Lifecycle Management**: Accept, confirm, or cancel customer booking requests with instant database status synchronization.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS v4
* **Animations**: Motion (`motion/react`)
* **Routing**: React Router DOM v7
* **HTTP Client**: Axios (with centralized request interceptors for auth tokens)
* **Notifications**: React Hot Toast
* **Hosting**: Vercel (with client-side SPA routing rewrites)

### Backend (`/server`)
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express 5
* **Database**: MongoDB Atlas with Mongoose ODM
* **Authentication**: JSON Web Tokens (JWT) + Bcrypt password hashing
* **Media Storage & CDN**: ImageKit + Multer (file buffer upload and WebP auto-compression)
* **Hosting**: Vercel

---

## 📁 Project Structure

```text
Car-Rental/
├── README.md                      # Full project documentation
├── vercel.json                    # Root SPA rewrite configuration
├── client/                        # React Frontend (Vite)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── assets/                # Icons, logos, and illustration assets
│   │   ├── components/            # Reusable UI components (Navbar, CarCard, Hero, etc.)
│   │   │   └── owner/             # Owner components (NavbarOwner, Sidebar, Title)
│   │   ├── context/               # Global state (AppContext, auth, currency, bookings)
│   │   ├── pages/                 # Route pages (Home, Cars, CarDetails, MyBookings)
│   │   │   └── owner/             # Owner views (Dashboard, AddCar, ManageCars, ManageBookings)
│   │   ├── App.jsx                # Main application component & routes
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind and global styles
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json                # Vercel SPA routing rewrites
└── server/                        # Express Backend
    ├── configs/                   # Database (MongoDB) and ImageKit configurations
    ├── controllers/               # Business logic (userController, ownerController, bookingController)
    ├── middlewares/               # JWT auth verification middleware
    ├── models/                    # Mongoose schemas (Car, User, Booking)
    ├── routes/                    # API route declarations
    ├── server.js                  # Express entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB**: A MongoDB Atlas cluster URI or local MongoDB instance
* **ImageKit**: Free account for image hosting credentials

---

### 1. Clone Repository
```bash
git clone https://github.com/kkrishkataria/Car-Rental.git
cd Car-Rental
```

---

### 2. Backend Setup (`/server`)

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/car-rental
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY='your_imagekit_public_key'
   IMAGEKIT_PRIVATE_KEY='your_imagekit_private_key'
   IMAGEKIT_URL_ENDPOINT='https://ik.imagekit.io/your_endpoint_id'
   CLIENT_URL=http://localhost:5173
   ```

3. Start the backend development server:
   ```bash
   npm run server
   ```
   *The server runs by default on `http://localhost:5000` (or configured PORT).*

---

### 3. Frontend Setup (`/client`)

1. Open a new terminal, navigate to the client directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in the `client/` directory:
   ```env
   VITE_BASE_URL=http://localhost:5000/
   VITE_CURRENCY=₹
   ```
   *(For production, point `VITE_BASE_URL` to your deployed backend on Vercel).*

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 📡 API Endpoints

### User & Authentication (`/api/user`)
* `POST /api/user/register` - Create a new customer or owner account
* `POST /api/user/login` - Authenticate user & return JWT token
* `GET /api/user/data` - Retrieve logged-in user profile (`protect` middleware)

### Owner Endpoints (`/api/owner`)
* `GET /api/owner/all-cars` - Fetch all available cars listed across the platform
* `GET /api/owner/cars` - Fetch cars listed by the authenticated owner
* `GET /api/owner/cars/:id` - Fetch single car details
* `POST /api/owner/add-car` - Upload image and create a new car listing (`protect` middleware)
* `POST /api/owner/delete-car` - Delete a car listing and its associated bookings
* `POST /api/owner/toggle-car-status` - Toggle vehicle availability flag
* `GET /api/owner/dashboard` - Fetch dashboard statistics and monthly revenue

### Bookings (`/api/bookings`)
* `POST /api/bookings/check-availablity` - Filter available cars by city and date range
* `POST /api/bookings/create` - Book a car for specified dates
* `GET /api/bookings/user` - Fetch bookings made by the current customer
* `GET /api/bookings/owner` - Fetch booking requests for owner's vehicles
* `POST /api/bookings/change-status` - Update booking status (`confirmed`, `cancelled`, `pending`)

---

## ☁️ Deployment

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variables:
   * `VITE_BASE_URL`: URL of your deployed backend on Vercel
   * `VITE_CURRENCY`: `₹`
5. Deploy. SPA rewrites are handled automatically via `client/vercel.json`.

### Backend (Vercel)
1. Import repository on [Vercel](https://vercel.com) (or deploy via Vercel CLI).
2. Set **Root Directory** to `server`.
3. Add backend environment variables:
   * `MONGODB_URI`
   * `JWT_SECRET`
   * `IMAGEKIT_PUBLIC_KEY`
   * `IMAGEKIT_PRIVATE_KEY`
   * `IMAGEKIT_URL_ENDPOINT`
   * `CLIENT_URL`
4. Deploy.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).

