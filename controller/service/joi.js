const joi = require('@hapi/joi');

function checkPhone(value, helpers) {

    if (((typeof value) != 'number') || value.toString().length !== 10 || value == undefined) {
      return helpers.error('Incorrect Phone number')
    }
  
    return value;
  
}

const schema = {

    // signup schema
    signup: joi.object({
      name: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    
      email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    
      phone: joi.number().custom(checkPhone, 'Phone number validator').required(),
    
      password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  
      role: joi.string().required()
  
    }),
    
    // login schema
    login: joi.object({
      phone: joi.custom(checkPhone, 'Phone number validator').required(),
  
      password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  
    }),

    // adding institute shchema
    addInstitute: joi.object({
      basicInfo : joi.object({
        name : joi.string().required(),
        contactNumber : joi.custom(checkPhone, 'Phone number validator').required(),
      }),

      address: joi.object({
        addressLine: joi.string(),
        locality: joi.string(),
        state: joi.string(),
        city: joi.string(),
        pin: joi.number()
      }),

      location : joi.object({
        type: joi.string().trim(),
        coordinates: joi.array()
      }),

      category : joi.array(),

      metaTag : joi.array()
      
    }),

    resetPassword: joi.object({
      phone: joi.custom(checkPhone, 'Phone number validator').required(),
      password: joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      otp: joi.number().required()
    }),

    addStudent: joi.object({
      instituteId : joi.required(),
      basicDetails: joi.object({
        name: joi.required(),
        rollNumber: joi.required(),
        contactNumber: joi.custom(checkPhone, 'Phone number validator').required()
      }),
      parentDetails: joi.object({
        name: joi.required(),
        contactNumber: joi.custom(checkPhone, 'Phone number validator').required()
      }),
      courseDetails: joi.object({
        course: joi.required()
      })
      
    })
  }

  module.exports = function (SchemaName) {
    return schema[SchemaName];
  }