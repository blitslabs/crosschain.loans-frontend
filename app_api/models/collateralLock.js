module.exports = (sequelize, DataTypes) => {
    return sequelize.define('collateralLock', {
        contractLoanId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bCoinContractLoanId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        borrower: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bCoinBorrowerAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secretHashA1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secretHashB1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secretA1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secretB1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        loanExpiration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        collateral: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        collateralValue: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lockPrice: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        liquidationPrice: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blockchain: {
            type: DataTypes.STRING,
        },
        network: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        collateralLockContractAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        loansContractAddress: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}