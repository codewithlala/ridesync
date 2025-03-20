# Car Rental Project

The Car Rental project is a comprehensive MERN stack web application tailored for small rental companies. It encompasses end-to-end functionality, including user authentication, booking management, and admin features. This application is built using Node.js, Express.js, React.js, Redux, MongoDB, and Mongoose.

## Project Features

- User authentication for secure access to the platform.
- Booking management system for efficient rental services.
- Admin dashboard with specialized features for company management.

## New Features

### Customer Ratings and Feedback System

We've implemented a comprehensive car rating and feedback system that allows users to:

1. **Rate Cars**: After completing a booking, users can rate their car rental experience on a 5-star scale.
2. **Leave Feedback**: Users can provide detailed comments about their experience.
3. **View Car Ratings**: All cars display their average rating in the car list and detail views.
4. **View Feedback Statistics**: A new dashboard shows overall rating statistics, distribution, and top-rated cars.

#### Implementation Details:

- **Feedback Form**: After successful payment, users have the option to rate the car.
- **Rating Storage**: All ratings are stored in the browser's localStorage for persistence.
- **Car Preview**: Added a car preview feature to see more details before booking.
- **Rating Indicators**: Cars with feedback have additional indicators in the listings.
- **Rating Dashboard**: A summary dashboard on the user's bookings page shows rating statistics.

### Other Improvements

- Changed currency symbol from $ to ₹ for the Indian market
- Fixed fuel type filtering to handle different casing formats
- Added proper error handling in various components
- Improved the UI/UX with detailed car previews and better feedback

## Live Link

[Click here to visit Car Rental](https://car-rental-p1wz.vercel.app/)

## How to Use

1. Clone the repository:

```bash
git clone https://github.com/pjyotianwar/CarRental.git
```

2. Install dependencies for both the server and client:

```bash
cd CarRental
npm install
cd client
npm install
```

3. Start the server and client:

```bash
# In the main project directory
npm run dev
```

4. Open your browser and visit `http://localhost:3000` to start using Car Rental.

## Project Structure

- `client`: Contains the React.js frontend of the project.
- `server`: Contains the Node.js and Express.js backend of the project.

## Screenshots

<img width="1440" alt="CarRental 1" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/bbe56b53-c3fa-47e7-bf97-62db012950a1">
<br><br>
<img width="1440" alt="CarRental 2" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/89a8c5fa-e00f-4904-80c4-33d10f554a23">
<br><br>
<img width="1023" alt="CarRental 3" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/f673c18a-6d47-4e9d-9176-7e76339b5044">
<br><br>
<img width="1024" alt="CarRental 4" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/69a685c1-0292-4ad6-822c-7f1410776e9e">
<br><br>
<img width="1026" alt="CarRental 5" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/b081b2d8-943f-4151-bcea-77961d3212a7">
<br><br>
<img width="1022" alt="CarRental 6" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/aa000364-7f97-4fcb-9486-41a14d869ec2">
<br><br>
<img width="1038" alt="CarRental 7" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/bf666a46-3c02-492e-9ede-7fd4a5411cd3">
<br><br>
<img width="1042" alt="CarRental 8" src="https://github.com/pjyotianwar/Car-Rental/assets/70092582/4b5011a5-5191-463e-99e9-9f7222363512">

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

## Acknowledgements

- Special thanks to the developers and contributors of the libraries and technologies used in this project.
