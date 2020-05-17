import { Component, OnInit } from '@angular/core';
import { DialogflowService } from 'src/app/service/dialogflow.service';

@Component({
  selector: 'app-chatbot',
  providers: [DialogflowService],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  constructor(private service: DialogflowService) { }

  poster_path = '';
  messages: any = [];
  userMessage = '';
  bot_url = 'https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png';
  user_url = 'https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png';


  ngOnInit() {
    this.userMessage = 'Hola';
    this.sendMessage(1);
  }
  sendMessage(flag) {
    let splitString = [];
    let customMessage = '';
    const tempMessage = this.userMessage;
    let userResponse = {
      url: this.user_url,
      text: this.userMessage
    };
    if (!flag) {
      this.messages.push(userResponse);
    }
    this.userMessage = '';
    this.service.getResponseFromAgent(tempMessage).then(result => {
    let url = result.result.fulfillment.speech;
    console.log(result.result.fulfillment);
    if (result.result.action.toString() === 'get-movie-details') {
      splitString = url.split('url');
      customMessage = splitString[0];
      this.poster_path = splitString[1] ? splitString[1].replace(/['"]+/g, '') : '';
    }
      let botResponse = {
        url: this.bot_url,
        text: customMessage ? customMessage : url,
        poster_path: this.poster_path ? 'http://image.tmdb.org/t/p/w154/' + this.poster_path : ''
      };
      this.messages.push(botResponse);
    });
    this.poster_path = '';
  }

  floatMessage(message: any) {
    if (message.url === this.user_url) {
      return 'float: right;';
    } else {
      return '';
    }
  }

}
