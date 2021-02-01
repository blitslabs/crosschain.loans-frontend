const { sendJSONresponse } = require('../utils')
const { EmailNotification, SystemSettings, Loan, CollateralLock } = require('../models/sequelize')
const nodemailer = require('nodemailer')
const moment = require('moment')

module.exports.saveEmailNotificationAccount = async (req, res) => {

    const { email, account } = req.body

    if (!email || !account) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    await EmailNotification.findOrCreate({
        where: {
            email, account
        },
        defaults: {
            email, account
        }
    })

    sendJSONresponse(res, 200, { status: 'OK', message: 'Email Notification Account Saved' })
    return
}

module.exports.getEmailNotificationAccount = async (req, res) => {

    const { account } = req.params

    if (!account) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required parameters' })
        return
    }

    const emailNotification = await EmailNotification.findOne({
        where: {
            account
        }
    })

    sendJSONresponse(res, 200, { status: 'OK', payload: emailNotification })
    return
}


module.exports.sendLoanCreatedEmailNotification = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const notificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    if (!notificationEmail) return { status: 'ERROR', message: 'Account does not have notification email' }

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    const subject = 'New Loan Created | Cross-chain Loans'
    const msg = `You created a new loan offer: \n \n Account: ${loan.lender} \n Duration: 30 days \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

    try {
        await transporter.verify()
        await transporter.sendMail({
            from: settings.SMTP_USER,
            to: notificationEmail.email,
            subject,
            text: msg
        })
        return { status: 'OK', message: 'Email notification sent' }

    } catch (e) {
        console.error(e)
        return { status: 'ERROR', message: 'Error sending email' }
    }
}

module.exports.sendLoanCanceled = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const notificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    if (!notificationEmail) return { status: 'ERROR', message: 'Account does not have notification email' }

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    const subject = 'Loan Canceled | Cross-chain Loans'
    const msg = `You canceled a loan offer: \n \n Account: ${loan.lender} \n Duration: 30 days \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

    try {
        await transporter.verify()
        await transporter.sendMail({
            from: settings.SMTP_USER,
            to: notificationEmail.email,
            subject,
            text: msg
        })
        return { status: 'OK', message: 'Email notification sent' }

    } catch (e) {
        console.error(e)
        return { status: 'ERROR', message: 'Error sending email' }
    }
}

module.exports.sendCollateralLocked = async (collateralLockId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const collateralLock = await CollateralLock.findOne({ where: { id: collateralLockId } })

    if (!collateralLock) return { status: 'ERROR', message: 'Collareal Lock not found' }

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: collateralLock.bCoinBorrowerAddress
        }
    })

    // Get Lender's bCoin account with his aCoin account
    // 1. Get Loan
    const loan = await Loan.findOne({
        where: {
            contractLoanId: collateralLock.bCoinContractLoanId,
            loansContractAddress: collateralLock.loansContractAddress,
            status: 1
        }
    })

    // 2. Get Lender's email
    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (borrowerNotificationEmail) {

        const subject = 'Collateral Locked | Cross-chain Loans'
        const msg = `You locked the required collateral for a loan offer: \n\n Collateral Details \n Collateral: ${collateralLock.collateral} \n Blockchain: ${collateralLock.blockchain} \n\n Loan Details \n Duration: 30 days \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loan.id} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })
        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    await sleep(2000)

    if (lenderNotificationEmail) {

        const subject = 'Required Collateral Locked by Borrower | Cross-chain Loans'
        const msg = `The collateral required for your loan offer was locked by a borrower: \n \n Collateral Details \n Account (Borrower): ${collateralLock.bCoinBorrowerAddress} \n Collateral: ${collateralLock.collateral} \n Blockchain: ${collateralLock.blockchain} \n SecretHashA1: ${collateralLock.secretHashA1} \n\n Loan Details \n Account (Lender): ${loan.lender} \n Duration: 30 days \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loan.id} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendLoanApproved = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    // if (lenderNotificationEmail) {
    //     const subject = 'Loan Approved | Cross-chain Loans'
    //     const msg = `The principal of your loan was withdrawn by the borrower: \n \n Account (Borrower): ${loan.borrower} \n Loan Expiration: ${moment.unix(loan.loanExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

    //     try {
    //         await transporter.verify()
    //         await transporter.sendMail({
    //             from: settings.SMTP_USER,
    //             to: lenderNotificationEmail.email,
    //             subject,
    //             text: msg
    //         })
    //         console.log({ status: 'OK', message: 'Email notification sent' })

    //     } catch (e) {
    //         console.error(e)
    //         // return { status: 'ERROR', message: 'Error sending email' }
    //     }
    // }

    if (borrowerNotificationEmail) {
        const subject = 'Loan Approved | Cross-chain Loans'
        const msg = `Your loan request was approved and you can now withdraw the loan's principal. \n \n Account (Borrower): ${loan.borrower} \n Loan Expiration: ${moment.unix(loan.loanExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendPrincipalWithdrawn = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (lenderNotificationEmail) {
        const subject = 'Loan Principal Withdrawn | Cross-chain Loans'
        const msg = `The principal of your loan was withdrawn by the borrower: \n \n Account (Borrower): ${loan.borrower} \n Loan Expiration: ${moment.unix(loan.loanExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    if (borrowerNotificationEmail) {
        const subject = 'Loan Principal Withdrawn | Cross-chain Loans'
        const msg = `You withdrew the principal of a loan: \n \n Account (Borrower): ${loan.borrower} \n Loan Expiration: ${moment.unix(loan.loanExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendPayback = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (lenderNotificationEmail) {
        const subject = 'Loan Repaid | Cross-chain Loans'
        const msg = `Your loan was repaid by the borrower. Please Accept the Borrower's Payback before ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC to complete the loan. \n \n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    if (borrowerNotificationEmail) {
        const subject = 'Loan Repaid | Cross-chain Loans'
        const msg = `Your loan was repaid successfully. You will be able to unlock your collateral once the Lender accepts the Payback (before ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC). If the Lender fails to accept the payback before this date, you'll be able to unlock a part of your collateral and refund your payback. \n \n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendPaybackAccepted = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (lenderNotificationEmail) {
        const subject = 'Payback Accepted | Cross-chain Loans'
        const msg = `You accepted the payback made by the borrower of your loan. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    if (borrowerNotificationEmail) {
        const subject = 'Payback Accepted | Cross-chain Loans'
        const msg = `The Lender accepted the payback you made and you are now able to unlock your collateral. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendPaybackRefunded = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (lenderNotificationEmail) {
        const subject = 'Payback Refunded | Cross-chain Loans'
        const msg = `You failed to accept the borrower's payback so it was refunded. You are able to seize part of the borrower's collateral to close the loan. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    if (borrowerNotificationEmail) {
        const subject = 'Payback Refunded | Cross-chain Loans'
        const msg = `You refunded your payback. You are able to unlock part of your collateral to close the loan. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendCollateralSeized = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const lenderNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    const borrowerNotificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.borrower
        }
    })

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    if (lenderNotificationEmail) {
        const subject = 'Collateral Seized | Cross-chain Loans'
        const msg = `You seized part of the borrower's collateral. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: lenderNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }

    if (borrowerNotificationEmail) {
        const subject = 'Refundable Collateral Unlocked | Cross-chain Loans'
        const msg = `Part of your locked collateral was unlocked. \n\n Account (Borrower): ${loan.borrower} \n Accept Payback Expiration: ${moment.unix(loan.acceptExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

        try {
            await transporter.verify()
            await transporter.sendMail({
                from: settings.SMTP_USER,
                to: borrowerNotificationEmail.email,
                subject,
                text: msg
            })
            console.log({ status: 'OK', message: 'Email notification sent' })

        } catch (e) {
            console.error(e)
            // return { status: 'ERROR', message: 'Error sending email' }
        }
    }
}

module.exports.sendCollateralUnlocked = async (loanId) => {

    const settings = await SystemSettings.findOne({ where: { id: 1 } })

    if (!settings) return { status: 'ERROR', message: 'Error sending email' }

    const loan = await Loan.findOne({ where: { id: loanId } })

    if (!loan) return { status: 'ERROR', message: 'Loan not found' }

    const notificationEmail = await EmailNotification.findOne({
        where: {
            account: loan.lender
        }
    })

    if (!notificationEmail) return { status: 'ERROR', message: 'Account does not have notification email' }

    const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: settings.SMTP_PORT,
        secure: true,
        auth: {
            user: settings.SMTP_USER,
            pass: settings.SMTP_PASSWORD
        }
    })

    const subject = 'Collateral Unlocked | Cross-chain Loans'
    const msg = `You unlocked your collateral. \n\n Account: ${loan.borrower} \n Duration: 30 days \n Principal: ${loan.principal} \n Interest: ${loan.interest} \n Token: ${loan.tokenName} \n Blockchain: ${loan.blockchain} \n Network: ${loan.network} \n \n View Loan Details: \n ${process.env.SERVER_HOST}/app/loan/${loanId} \n \n - Crosschain Loans Protocol`

    try {
        await transporter.verify()
        await transporter.sendMail({
            from: settings.SMTP_USER,
            to: notificationEmail.email,
            subject,
            text: msg
        })
        return { status: 'OK', message: 'Email notification sent' }

    } catch (e) {
        console.error(e)
        return { status: 'ERROR', message: 'Error sending email' }
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}