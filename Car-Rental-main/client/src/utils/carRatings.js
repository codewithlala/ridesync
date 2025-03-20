/**
 * Utility functions for managing car ratings in localStorage
 */

// Get all car ratings from localStorage
export const getAllCarRatings = () => {
  try {
    const ratings = localStorage.getItem("carRatings");
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error("Error getting car ratings from localStorage:", error);
    return {};
  }
};

// Get rating for a specific car
export const getCarRating = (carId) => {
  const ratings = getAllCarRatings();
  return ratings[carId] ? ratings[carId].rating : 4.5; // Default rating
};

// Check if a car has feedback
export const hasCarFeedback = (carId) => {
  const ratings = getAllCarRatings();
  return Boolean(ratings[carId] && ratings[carId].comment);
};

// Save a new rating
export const saveCarRating = (carId, rating, comment, bookingId) => {
  try {
    const ratings = getAllCarRatings();

    ratings[carId] = {
      rating,
      comment,
      timestamp: new Date().toISOString(),
      bookingId,
    };

    localStorage.setItem("carRatings", JSON.stringify(ratings));
    return true;
  } catch (error) {
    console.error("Error saving car rating:", error);
    return false;
  }
};

// Get top rated cars (returns array of car IDs sorted by rating)
export const getTopRatedCarIds = (limit = 5) => {
  const ratings = getAllCarRatings();

  return Object.entries(ratings)
    .sort(([, a], [, b]) => b.rating - a.rating)
    .slice(0, limit)
    .map(([carId]) => carId);
};

// Get average rating across all cars
export const getAverageRating = () => {
  const ratings = getAllCarRatings();
  const ratingValues = Object.values(ratings).map((r) => r.rating);

  if (ratingValues.length === 0) return 0;

  const sum = ratingValues.reduce((acc, curr) => acc + curr, 0);
  return sum / ratingValues.length;
};

// Count total ratings
export const getTotalRatingsCount = () => {
  return Object.keys(getAllCarRatings()).length;
};

// Clear all ratings (for testing)
export const clearAllRatings = () => {
  localStorage.removeItem("carRatings");
};
