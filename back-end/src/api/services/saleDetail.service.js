const { Sales, Users, Products } = require('../../database/models');

const getUserId = (id) => Users.findOne({ where: { id } });

const getSale = async (id) => {
  const allSales = await Sales.findAll({ 
    where: { id },
    include: [
      { model: Users, as: 'seller', attributes: { exclude: ['id', 'email', 'password', 'role'] } },
      { model: Products, as: 'products', attributes: { exclude: ['urlImage'] } },
    ],
   });

  return allSales[0];
};

module.exports = {
  getSale,
};

