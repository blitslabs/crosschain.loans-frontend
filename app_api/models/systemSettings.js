module.exports = (sequelize, DataTypes) => {
    return sequelize.define('systemSettings', {
        matchingEngineActive: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        SMTP_HOST: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        SMT_PORT: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        SMTP_USER: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        SMTP_PASSWORD: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })
}