declare namespace Express {
  interface Request {
    User: User;
    userRole: string;
  }
}
