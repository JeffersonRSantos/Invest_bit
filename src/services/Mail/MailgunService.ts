import formData from "form-data";
import Mailgun from "mailgun.js";
import { knex } from "../Database/connection";
import { methodSendMail, statusTransation } from "../../utils/Enums/common";
const mailgun = new Mailgun(formData);
require("dotenv").config();

export class MailgunService{
  public user_id: any
  public to: string = ''
  public subject: string = ''
  public html: string = ''
  private from: string = `"InvestBit" <${process.env.MAIL_FROM}>`

  constructor(user_id: any, to: any, subjecy: string, html: string){
    this.user_id = user_id
    this.to = to
    this.subject = subjecy
    this.html = html
  }

  async send(){
    const emailInfo = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      html: this.html,
    };
  
    const mg = mailgun.client({
      username: "api",
      key: `${process.env.MAIL_KEY}`,
      timeout: 60000,
    });
  
    try {
      await mg.messages.create(`${process.env.MAIL_DOMAIN}`,emailInfo);
  
      await knex('tb_notifications').insert({
        user_id: this.user_id, 
        content_notification: JSON.stringify({emailInfo}), 
        method_send: methodSendMail.MAIL, 
        status_send: statusTransation.SUCCESS
      })
    } catch (error) {
      await knex('tb_notifications').insert({
        user_id: this.user_id, 
        content_notification: JSON.stringify({emailInfo ,error}), 
        method_send: methodSendMail.MAIL, 
        status_send: statusTransation.ERROR
      })
    }
  }
};
