module.exports = (sequelize, DataTypes) => {
    return sequelize.define('autoLender', {
        publicKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        privateKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        blockchain: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'ACTIVE'
        }
    })
}