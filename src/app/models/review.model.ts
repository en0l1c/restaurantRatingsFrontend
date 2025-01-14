import {User} from './user.model';

export interface Review {
  id?: number;
  user?: User;
  userId?: number;
  restaurantId: number;
  rating: number;
  comment: string;
  isEditing?: boolean;
  hidden?: boolean;
}
