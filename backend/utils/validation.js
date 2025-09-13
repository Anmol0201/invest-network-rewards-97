const Joi = require('joi');

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin', 'staff'),
    referralCode: Joi.string().optional()
  });
  
  return schema.validate(user);
};

const validatePlan = (plan) => {
  const schema = Joi.object({
    name: Joi.string().valid('Base', 'Silver', 'Gold', 'Diamond').required(),
    joinFee: Joi.number().min(0).required(),
    dailyInvestment: Joi.number().min(0).required(),
    duration: Joi.number().min(1).default(365),
    features: Joi.array().items(Joi.string()),
    profitPercentage: Joi.number().min(0).max(100),
    referralBonus: Joi.number().min(0).max(100)
  });
  
  return schema.validate(plan);
};

const validateWithdrawal = (withdrawal) => {
  const schema = Joi.object({
    amount: Joi.number().min(100).required(),
    bankDetails: Joi.object({
      accountNumber: Joi.string().required(),
      ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required()
    }).required()
  });
  
  return schema.validate(withdrawal);
};

const validateContent = (content) => {
  const schema = Joi.object({
    type: Joi.string().valid('news', 'advertisement', 'marketing', 'announcement').required(),
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).required(),
    status: Joi.string().valid('draft', 'published', 'scheduled', 'archived'),
    scheduledDate: Joi.date().greater('now'),
    targetAudience: Joi.string().valid('all', 'new_users', 'active_users', 'premium_users'),
    priority: Joi.number().min(1).max(5)
  });
  
  return schema.validate(content);
};

const validateLogin = (loginData) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  return schema.validate(loginData);
};

module.exports = {
  validateUser,
  validatePlan,
  validateWithdrawal,
  validateContent,
  validateLogin
};