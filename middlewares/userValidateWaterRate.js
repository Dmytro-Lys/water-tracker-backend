import { userSchemaWaterRate } from '../models/User.js';
import { validateBody } from '../decorators/index.js';

const userValidateWaterRate = validateBody(userSchemaWaterRate)

export default userValidateWaterRate;