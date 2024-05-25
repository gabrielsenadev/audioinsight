import { v4 as uuidv4 } from 'uuid';

export const generateID = () => uuidv4().replaceAll('-', '').substring(0, 8);
