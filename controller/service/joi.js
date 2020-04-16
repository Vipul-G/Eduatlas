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
        addressLine: joi.string().allow(''),
        locality: joi.string().allow(''),
        state: joi.string().allow(''),
        city: joi.string().allow(''),
        pin: joi.number().allow(null)
      }).optional(),

      location : joi.object({
        type: joi.string().trim(),
        coordinates: joi.array()
      }).optional(),

      category : joi.array().optional(),

      metaTag : joi.array().optional()
      
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
        name: joi.string().allow(''),
        contactNumber: joi.custom(checkPhone, 'Phone number validator'),
        email: joi.string().allow(''),
        address: joi.string().allow('')
      }),
      courseDetails: joi.object({
        course: joi.string().allow(''),
        batch: joi.string().allow(''),
        discount: joi.number().allow(null),
        additionalDiscount: joi.number().allow(null),
        nextPayble: joi.string().allow('')
      }),
      fees : joi.object({
        installmentNumber: joi.number().allow(null),
        nextInstallment: joi.number().allow(null),
        amountCollected: joi.number().allow(null),
        mode: joi.string().allow('')
      })
      
    })
  }

  module.exports = function (SchemaName) {
    return schema[SchemaName];
  }