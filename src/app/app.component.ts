import { Component } from '@angular/core';
import { PlatformClient, UsuariosService } from "./app.service";
import { DadosUsuario, Usuario } from "./classes"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [
    PlatformClient, UsuariosService
  ]
})

export class AppComponent {
  title = 'tutorial-aplicacao-integrada-plataforma';
  dadosUsuario = new DadosUsuario();
  listaUsuarios: Usuario[] = [];

  constructor(private usuarios: UsuariosService) { }

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
}