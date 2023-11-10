import { userSchemaAll } from '../models/User.js';
import { validateBody } from '../decorators/index.js';

const userValidateAll = validateBody(userSchemaAll)

export default userValidateAll;