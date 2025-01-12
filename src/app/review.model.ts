import {User} from './user.model';

export interface Review {
  id?: number;  // Optional for new reviews
  user?: User;
  userId?: number; // Backend sets this
  restaurantId: number;
  rating: number;
  comment: string;
  isEditing?: boolean;
  hidden?: boolean;
}
