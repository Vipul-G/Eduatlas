const joi = require('@hapi/joi');

function checkPhone(value, helpers) {
    if (((typeof value) != 'number') || value.toString().length !== 10) {
      if (value == null) {
        return value;
      }
      return helpers.error('Phone number')
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
        instituteContact : joi.custom(checkPhone, 'Phone number validator').required(),
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
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        studentContact: joi.custom(checkPhone, 'Phone number validator').required()
      }),
      parentDetails: joi.object({
        name: joi.string().allow(''),
        parentContact: joi.custom(checkPhone, 'Phone number validator'),
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
      
    }),

    addCourse: joi.object({
      name: joi.string().required(),
      code: joi.string().required(),
      fees: joi.string().allow(''),
      discription: joi.string().allow(''),
      gst: joi.string().allow(''),
      totalFee: joi.string().allow('')
    }),

    addBatch: joi.object({
      courseId: joi.string().required(),
      code: joi.string().required(),
      description: joi.string().allow('')
    }),

    addDiscount: joi.object({
      code: joi.string().required(),
      description: joi.string().allow(''),
      amount: joi.string().required()
    }),

    addReciept: joi.object({
      businessName: joi.string().allow(''),
      address: joi.object({
        addressLine: joi.string().allow(''),
        locality: joi.string().allow(''),
        state: joi.string().allow(''),
        city: joi.string().allow(''),
        pin: joi.string().allow('')
      }).optional(),
      gstNumber: joi.string().allow(''),
      termsAndCondition: joi.string().allow(''),
      fee: joi.string().allow('')
    })
  }

  module.exports = function (SchemaName) {
    return schema[SchemaName];
  }
  // businessName: { type: String },

  // address: { 
  //   type: new Schema({
  //   addressLine: { type: String },
  //   locality: { type: String },
  //   state: { type: String},
  //   city: { type: String },
  //   pin: { type: Number, set: parseNumber }
  // }, {_id: false}), required: false, default: null },

  // gstNumber: { type: Number, set: parseNumber },

  // termsAndCondition: { type: String, required: false }