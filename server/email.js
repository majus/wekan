import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Log } from 'meteor/logging';
import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';

const { service, domain, apiKey } = Meteor.settings.email ?? {};

if (service === 'mailgun') {
  const transport = nodemailer.createTransport(mailgun({
    auth: {
      domain,
      api_key: apiKey,
    },
  }));
  const sendMailSync = Meteor.wrapAsync(transport.sendMail, transport);
  Email.hookSend(function(options) {
    const response = sendMailSync(options);
    Log({
      message: 'E-mail has been sent',
      to: options.to,
      subject: options.subject,
      response,
    });
    // Prevent default E-mail sending logic
    return false;
  });
}
