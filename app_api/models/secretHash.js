module.exports = (sequelize, DataTypes) => {
    return sequelize.define('secretHash', {
        account: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secretHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}