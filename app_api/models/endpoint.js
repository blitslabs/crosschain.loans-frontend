module.exports = (sequelize, DataTypes) => {
    return sequelize.define('endpoint', {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        endpoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endpointType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'HTTP'
        },
        blockchain: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ETH'
        },
        network: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'mainnet'
        },
        shard: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'ACTIVE'
        }
    })
}