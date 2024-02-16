import Joi from 'joi'
import { joiPasswordExtendCore } from 'joi-password'

const joiPassword = Joi.extend(joiPasswordExtendCore)

export const loginSchema = Joi.object({
  login: Joi.string()
    .required()
    .messages({})
    .email({
      tlds: false,
    })
    .messages({
      'string.email': 'Entered value does not match email format',
      'any.required': 'Field is mandatory',
      'any.empty': 'Field is mandatory',
    }),

  password: joiPassword
    .string()
    .required()
    .minOfSpecialCharacters(1)
    .minOfLowercase(2)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .message('Bad format of password'),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      tlds: false,
    })
    .messages({
      'string.email': 'Entered value does not match email format',
      'any.required': 'Field is mandatory',
      'any.empty': 'Field is mandatory',
    }),
})
