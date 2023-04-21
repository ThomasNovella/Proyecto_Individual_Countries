const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
   id: {
      type: DataTypes.STRING(3),
      primaryKey: true,
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   flagImg: {
      type: DataTypes.STRING,
      allowNull: false
   },
   continent: {
      type: DataTypes.ENUM(
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Ocenia",
        "Antartica",
        "Africa"
      ),
      allowNull: false,
   },
    capital: {
      type: DataTypes.STRING,
      allowNull: false
   },
   subregion: {
      type: DataTypes.STRING,
      allowNull: true
  },
   area: {
      type: DataTypes.INTEGER,
// no puse allowNull porque ya viene seteado como true por default
  },
  population: {
      type: DataTypes.INTEGER,
    }
  },
  {timestamps:false}
  );
};
