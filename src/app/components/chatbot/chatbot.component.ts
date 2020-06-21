import { Component, OnInit } from '@angular/core';
import { DialogflowService } from 'src/app/service/dialogflow.service';
import { GraphService } from 'src/app/service/graph.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  providers: [DialogflowService],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  constructor(private service: DialogflowService, private graphService: GraphService) { }

  poster_path = '';
  messages: any = [];
  userMessage = '';
  bot_url = 'https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png';
  user_url = 'https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png';


  ngOnInit() {
    this.userMessage = 'Hola';
    this.sendMessage(1);
    this.graphService.messageSource.subscribe((response) => {
      console.log('In subscribe');
      this.responseChatbot(response);
    });
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
      this.scrollChat();
    }
    this.userMessage = '';
    this.service.getResponseFromAgent(tempMessage).then(result => {
      let url = result.result.fulfillment.speech;
      console.log(result.result.fulfillment);
      if (result.result.action.toString() === 'drawGraph') {
        let json_draw = JSON.parse(result.result.fulfillment.speech);
        console.log(json_draw);
        splitString = url.split('url');
        customMessage = json_draw.resp;
        this.graphService.draw(json_draw.graph, json_draw.colname, json_draw.parameters);
        this.poster_path = '';
      }
      let botResponse = {
        url: this.bot_url,
        text: customMessage ? customMessage : url,
        poster_path: this.poster_path ? 'http://image.tmdb.org/t/p/w154/' + this.poster_path : ''
      };
      this.messages.push(botResponse);
      this.scrollChat();
    });
    this.poster_path = '';
  }

  responseChatbot(response: string) {
    console.log('pushing');
    this.messages.push({});
    this.messages.push({
      url: this.bot_url,
      text: response,
      poster_path: this.poster_path ? 'http://image.tmdb.org/t/p/w154/' + this.poster_path : ''
    });
    this.scrollChat();
  }

  scrollChat() {
    setTimeout(function() {
      const scrollingChat = document.getElementById('caja-chat');
      scrollingChat.scrollTop = scrollingChat.scrollHeight;
    } , 0);
  }

  floatMessage(message: any) {
    if (message.url === this.user_url) {
      return 'float: right;';
    } else {
      return '';
    }
  }

  transformDrawResponse(response: any) {

  }

}
