import {Review} from './review.model';

export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  averageRating: number;
  image: string;
  rankScore?: number;
  reviews?: Review[];

}
