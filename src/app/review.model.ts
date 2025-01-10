// export interface Review {
//   id?: number;  // Optional in case of new review
//   userId: number;
//   restaurantId: number;
//   rating: number;
//   comment: string;
// }

export interface Review {
  id?: number;  // Optional for new reviews
  userId?: number; // Backend sets this
  restaurantId: number;
  rating: number;
  comment: string;
}
