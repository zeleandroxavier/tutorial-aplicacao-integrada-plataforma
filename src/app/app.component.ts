import { Component } from '@angular/core';
import { PlatformClient, UsuariosService } from "./app.service";
import { DadosUsuario } from "./classes"

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

  constructor(private usuarios: UsuariosService) { }

  ngOnInit() {
    this.getDadosUsuario();
  }

  //Busca os dados do usuário autenticado
  getDadosUsuario() {
    this.usuarios.getDadosUsuario().subscribe(data => {
      this.dadosUsuario = data;
    });
  }
}