
declare namespace Express {
  interface Request {
    jw?: {
      user: {
        id: number;
        username: string;
      }
    };
  }
}
