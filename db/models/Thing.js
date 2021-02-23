module.exports = (sequelize, DataTypes) => {
  const Thing = sequelize.define("Thing", {
    name: { type: DataTypes.STRING, allowNull: false },
    isTreasure: { type: DataTypes.BOOLEAN },
  });

  return Thing;
};
