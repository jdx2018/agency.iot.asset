const nodemailer = require('nodemailer');

async function sendEmail(sendAddress_config, emailAddress, subject, text) {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: sendAddress_config.user, // generated ethereal user
                pass: sendAddress_config.pass // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: sendAddress_config.user, // sender address
            to: emailAddress, // list of receivers
            subject: subject, // Subject line
            text: text // plain text body
        };
        // send mail with defined transport object
        let res = await transporter.sendMail(mailOptions)
        // console.log("success")
        return { code: 1, message: '邮件发送成功.' }
    } catch (error) {
        console.log(error)
        return { code: -1, message: '邮件发送失败：' + error.message }
    }

}
module.exports.sendEmail = sendEmail;


// 测试：
// sendEmail(
//     {
//         user: '2574650379@qq.com',
//         pass: 'ilgdrlwvzxaadjcg'
//     },
//     "huang_hongfa@126.com",
//     "资产异常报警提醒-[报警类型]-[资产编号/资产名称]",
//     "您好，【资产编号/资产名称/使用部门/所在位置】产生报警记录，报警设备：【设备编号/IP/MAC/EPC】"
// );

// sendEmail(
//     {
//         user: '2574650379@qq.com',
//         pass: 'ilgdrlwvzxaadjcg'
//     },
//     'huang_hongfa@126.com',
//     `设备离线提醒-[设备ID: ${1111}/名称: xxx]`,
//     `您好，【设备ID: ${1111}}/名称: xxx}/使用部门:销邦数据】发生离线，请检查并修复。`
// );