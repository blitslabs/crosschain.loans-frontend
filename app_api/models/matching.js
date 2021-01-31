module.exports = (sequelize, DataTypes) => {
    return sequelize.define('matching', {
        collateralLockTxHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assignBorrowerTxHash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        collateralLockBlockchain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        collateralLockContract: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loansBlockchain: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        loansContract: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        network: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aCoinLoanId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bCoinLoanId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bCoinBorrowerAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        secretHashA1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transactionSent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        matchingCompleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
}