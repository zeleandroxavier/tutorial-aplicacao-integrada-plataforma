import { Component } from '@angular/core';
import { PlatformClient, UsuariosService, NotificationService, BlobService } from "./app.service";
import { DadosUsuario, Usuario, RequestUploadResponse } from "./classes"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [
    PlatformClient, UsuariosService, NotificationService, BlobService
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

  //Atributos para uso do serviço de armazenamento de arquivos (BlobService)
  selectedFile: File = null;
  uploadDetails: RequestUploadResponse = null;
  downloadUrl = "";

  constructor(private usuarios: UsuariosService, private notification: NotificationService, private blob: BlobService) { }

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
  
  //Envia o arquivo para o serviço de armazenamento de arquivos
  sendFile() {
    if (this.selectedFile) {      
      this.blob.createArea().subscribe(data => {
        let fileName = this.selectedFile.name;
        let objectId = fileName.replace(/\.[^/.]+$/, "");        
        this.blob.requestUpload(objectId, fileName).subscribe(data => {
          this.uploadDetails = data;
          var reader = new FileReader();
          reader.onload = (evt: any) => {
            this.blob.uploadFile(this.uploadDetails.location.uri, evt.target.result).subscribe(data => {
              this.blob.commitFile(this.uploadDetails).subscribe(data => {
                this.blob.requestAccess(this.uploadDetails).subscribe(data => {
                  this.downloadUrl = data.location.uri;
                  console.log(this.downloadUrl);
                });
              });
            });
          };          
          reader.readAsArrayBuffer(this.selectedFile);
        });
      });
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }  
}