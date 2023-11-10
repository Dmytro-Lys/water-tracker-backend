export const addFieldMongoose = ({regExp, errorMessage, requiredErrorMessage}) => {
   return {
      type: String,
      match: [regExp, errorMessage],
      required: [true, requiredErrorMessage],
   }
}

const messagesErrorsJoi = (message, messageRequired ) => {
   const defaultMessage = "missing required {#label} field"
   return {
      "string.empty": messageRequired ? messageRequired : defaultMessage , 
      "any.required": messageRequired ? messageRequired : defaultMessage,
      "string.pattern.base": message
   }
}

export function addFieldJoi(  {regExp, errorMessage}, messageRequired ='', required = true) {
   return required ? this.string().required()
      .pattern(new RegExp(regExp))
      .messages(messagesErrorsJoi(errorMessage, messageRequired)) 
      : this.string()
      .pattern(new RegExp(regExp))
        .messages(messagesErrorsJoi(errorMessage, messageRequired))
}


// export function addFieldJoiOpt({ regExp, errorMessage }, { messageRequired = '', required = true, type = 'string' }) {
    
      
//    let joiType
//    switch (type) {
//      case 'number':
//        joiType = this.string().pattern(new RegExp(regExp))
//       .messages(messagesErrorsJoi(errorMessage, messageRequired));
//      break;

//      default:
//         joiType = this.string().pattern(new RegExp(regExp))
//       .messages(messagesErrorsJoi(errorMessage, messageRequired));
//    }

//    const joiRequired = required ? this.required() : {};
//    // return { ...joiType, ...joiRequired}.pattern(new RegExp(regExp)).messages(messagesErrorsJoi(errorMessage, messageRequired))
//    return { ...joiType, ...joiRequired}
// }