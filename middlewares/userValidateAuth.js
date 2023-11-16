import { userSchemaAuth } from '../models/User.js';
import { validateBody } from '../decorators/index.js';

const userValidateAuth = validateBody(userSchemaAuth)

export default userValidateAuth;