import { Component } from '@angular/core';
import { PlatformClient, UsuariosService, NotificationService } from "./app.service";
import { DadosUsuario, Usuario } from "./classes"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [
    PlatformClient, UsuariosService, NotificationService
  ]
})

export class AppComponent {
  title = 'tutorial-aplicacao-integrada-plataforma';
  dadosUsuario = new DadosUsuario();
  listaUsuarios: Usuario[] = [];

  //Atributos para o uso de notificações
  selectedUser: Usuario = null;
  subjectNotification = "";
  contentNotification = "";
  sendedNotification = "";

  constructor(private usuarios: UsuariosService, private notification: NotificationService) { }

  ngOnInit() {
    this.getDadosUsuario();
    this.getUsuarios();
  }

  //Busca os dados do usuário autenticado
  getDadosUsuario() {
    this.usuarios.getDadosUsuario().subscribe(data => {
      this.dadosUsuario = data;
    });
  }

  //Busca todos usuários do tenant
  getUsuarios() {
    this.usuarios.getUsuarios().subscribe(data => {
      this.listaUsuarios = data.usuarios as Usuario[];
    });
  }
  
  //Envia notificação para um determinado tenant
  sendNotification() {
    let destination = this.selectedUser.nome + '@' + this.dadosUsuario.tenantDomain;
    this.notification.sendNotification(destination, this.subjectNotification, this.contentNotification).subscribe(data => {
      this.sendedNotification = 'Notificação enviada para ' + destination;
    });
  }  
}