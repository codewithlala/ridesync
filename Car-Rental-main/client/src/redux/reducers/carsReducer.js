const initialData = {
  cars: [],
  error: null,
};

export const carsReducer = (state = initialData, action) => {
  switch (action.type) {
    case "GET_ALL_CARS": {
      return {
        ...state,
        cars: action.payload,
        error: null,
      };
    }
    case "SET_CARS_ERROR": {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
