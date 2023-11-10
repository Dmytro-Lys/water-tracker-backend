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