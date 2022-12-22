using System;
using System.Configuration;
using System.Net.Mail;

namespace Shop.Common
{
    public static class MailHelper
    {
        // toEmail: gửi đến email
        // subject: tiêu đề
        // content: nội dung
        public static bool SendMail(string toEmail, string subject, string content)
        {
            try
            {
                var host = ConfigHelper.GetByKey("SMTPHost");
                var port = int.Parse(ConfigHelper.GetByKey("SMTPPort"));
                var fromEmail = ConfigHelper.GetByKey("FromEmailAddress");
                var password = ConfigHelper.GetByKey("FromEmailPassword");
                var fromName = ConfigHelper.GetByKey("FromName");

                var smtpClient = new SmtpClient(host, port)
                {
                    UseDefaultCredentials = false, // Credentials: thông tin đăng nhập
                    Credentials = new System.Net.NetworkCredential(fromEmail, password),
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = true,
                    Timeout = 100000
                };

                var mail = new MailMessage
                    {
                        Body = content,
                        Subject = subject,
                        From = new MailAddress(fromEmail, fromName), 
                    };
                
                mail.To.Add(new MailAddress(toEmail));
                mail.BodyEncoding = System.Text.Encoding.UTF8;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;
                
                smtpClient.Send(mail);
                return true;

            }
            catch (SmtpException e)
            {
                return false;
            }
        }
    }
}