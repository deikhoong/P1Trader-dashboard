// Interface for the login form
export interface LoginForm {
  email: string;
  password: string;
}

// Type for the login response, containing user details and tokens
export type LoginResponse = {
  data: {
    user: UserListItem;
    access_token: string;
    refresh_token: string;
  }
}

// Pagination type for handling paginated requests
export type Pagination = {
  page: number;
  take: number;
}

// Type for individual users in a user list
export type UserListItem = {
  id?: string;
  email?: string;
  role?: UserRole;
  nickname?: string;
  tradingViewEmail?: string;
  discordId?: string;
}

// User information for updating or displaying user details
export type UserInfo = {
  email?: string;
  nickname?: string;
  tradingViewEmail?: string;
  discordId?: string;
  countryCode?: string;
  tel?: string;
}

// Request type for creating a new user
export type CreateUserRequest = {
  email: string;
  password: string;
  nickname: string;
  role: UserRole;
}

// Request type for updating an existing user's information
export type UpdateUserRequest = {
  nickname: string;
  tradingViewEmail?: string;
  discordId?: string;
  countryCode?: string;
  tel?: string;
}

// Enum for defining user roles
export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}

export type EventListItem = {
  id: string;
  cover: {
    id: string;
    url: string;
  };
  title: string;
  type: EventType;
  location: EventLocation;
  startDate: string;
};

export type EventInfo = {
  cover: {
    id: string;
    url: string;
  };
  title: string;
  type: EventType;
  location: EventLocation;
  startDate: string;
  content: string;
  speaker: string;
  speakerDescription: string;
  speakerAvatar: {
    id: string;
    url: string;
  };
  views: number;
  recapsTitle: string;
  recapsDescription: string;
  recapsAttendance: number;
  recapsDuration: number;
  recapsCover: {
    id: string;
    url: string;
  };
  recapsLink: string;
}

export type EventRequest = {
  coverId: string;
  title: string;
  type: EventType;
  location: EventLocation;
  startDate: string;
  content: string;
  speaker: string;
  speakerDescription: string;
  speakerAvatarId: string;
  recapsTitle: string;
  recapsDescription: string;
  recapsAttendance: number;
  recapsDuration: number;
  recapsCoverId: string;
  recapsLink: string;
}

export enum EventType {
  WEBINAR = 'Webinar',
  AMA = 'AMA Session',
}

export enum EventLocation {
  ONLINE = 'Online',
  TAIPEI = 'Taipei',
}

export type NewsListItem = {
  id: string;
  cover: {
    id: string;
    url: string;
  };
  title: string;
  type: NewsType;
};

export type NewsInfo = {
  cover: {
    id: string;
    url: string;
  };
  title: string;
  type: NewsType;
  content: string;
}

export type NewsRequest = {
  coverId: string;
  title: string;
  type: NewsType;
  content: string;
}

export enum NewsType {
  TRADING = 'Trading',
  MARKET_TRENDS = 'MarketTrends',
  ANALYSIS = 'Analysis',
  CRYPTO = 'Crypto',
}

export type CourseListItem = {
  id: string;
  name: string;
  price: number;
  language: string;
  subtitles: string;
};

export type CourseInfo = { 
  name: string;
  includes: string[];
  price: number;
  title: string;
  description: string;
  willLearns: string[];
  language: string;
  subtitles: string;
  tutorImage: {
    id: string;
    url: string;
  };
  tutorName: string;
  tutorDescription: string;
  tutorRating: string;
  tutorReviews: string;
  tutorStudents: string;
  tutorCourses: string;
  tutorIntro: string;
  updatedAt: string;
  curriculum: CourseCurriculum[];

}

export type CourseCurriculum ={
  name: string;
  lessons: number;
  durationTime: string;
}

