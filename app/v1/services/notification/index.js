const nodemailer = require('nodemailer');
const aws = require('aws-sdk');

aws.config = new aws.Config({
    accessKeyId: process.env.awsS3_accessKeyId || 'AKIASUXTQKY5KNPW6FES',
    secretAccessKey: process.env.awsS3_secretAccessKey || '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',
    region: process.env.awsS3_region || 'ap-south-1',

});

module.exports.send_email = async (from, to, message, subject) => {
    console.log(from)
    let transporter = nodemailer.createTransport({
        SES: new aws.SES({
            apiVersion: '2010-12-01'
        })
    });
    const sendMail = async () => {

        const new_from = `Centralex <${from}>`;

        let mailOptions = {
            from: new_from,
            to: to,
            subject: subject,
            html: `Hello,<br>${message}`
        };

        let info = await transporter.sendMail(mailOptions);
        if (info.messageId) {
            console.log('message sent', info.messageId);
            return {
                success: true,
                status: 200,
                messageId: info.messageId,
                message: "Email sent successfully."
            }
        } else {
            return {
                success: false,
                status: 200,
                message: info.toString()
            }
        }

    };

    let result = await sendMail();
        return result

};

/**
 * Utility to send a message to the given account
 */
const sms = async (content,to) => {
    try {
        const options = {
            'Message': content,
            'PhoneNumber': to
        };

        // send email type to transaction for high reliability
        const params = {
            attributes: {
                'DefaultSMSType': 'Transactional', /* highest reliability */
            }
        };

        // Create promise and SNS service object
        const setSMSTypePromise = new aws.SNS({ apiVersion: '2010-03-31' }).setSMSAttributes(params).promise();
        await Promise.all([setSMSTypePromise]);

        const sms_result_promise = new aws.SNS({ apiVersion: '2010-03-31' }).publish(options).promise();

        sms_result_promise.then(data => {
            console.log(data);

        }).catch(err => {
            console.log(err);
            return {
                success: false,
                status: 400,
                message: err.toString()
            }
        });

    } catch (err) {
        throw err;
    }
}
module.exports.send_sms = async (country_code,phone_number,name,message) => {
    try {
        let mainMessage = `Hi ${name}. ${message}`;
        let phone = `${country_code}${phone_number}`
        await sms(mainMessage, phone);
        return {
            success: true,
            status: 200,
            message: 'Message sent successfully.'
        }
    } catch (error) {
        throw error
    }
}
