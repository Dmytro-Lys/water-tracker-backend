export const addFieldMongoose = ({regExp, errorMessage, requiredErrorMessage}) => {
   return {
      type: String,
      match: [regExp, errorMessage],
      required: [true, requiredErrorMessage],
   }
}

const messagesErrorsJoi = (message, messageRequired ) => {
   const defaultRequiredMessage = "missing required {#label} field"
   const defaultEmptyMessage = "field {#label} is empty"
   return {
      "string.empty": messageRequired ? messageRequired : defaultRequiredMessage , 
      "any.required": messageRequired ? messageRequired : defaultEmptyMessage,
      "string.pattern.base": message
   }
}

export function addFieldJoi({ regExp, errorMessage },  messageRequired = '', required = true ) {
   return required ? this.string().required()
      .pattern(new RegExp(regExp))
      .messages(messagesErrorsJoi(errorMessage, messageRequired)) 
      : this.string()
      .pattern(new RegExp(regExp))
        .messages(messagesErrorsJoi(errorMessage, messageRequired))
}
