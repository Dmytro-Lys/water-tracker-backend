import { userSchemaEmail } from '../models/User.js';
import { validateBody } from '../decorators/index.js';

const userValidateEmail = validateBody(userSchemaEmail)

export default userValidateEmail;