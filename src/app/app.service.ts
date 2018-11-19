import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { service, user } from '@seniorsistemas/senior-platform-data';
import { Observable, forkJoin, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RequestUploadResponse } from './classes';

@Injectable()
export class PlatformClient {
    constructor(private http: HttpClient) { }

    getPlatformAPI(api: string): Observable<any> {
        return forkJoin(
            from(service.getRestUrl()),
            from(user.getAuthHeader()),
        ).pipe(mergeMap((values: any) => {
            const [restUrl, authHeader] = values;
            let headers = new HttpHeaders({
                "Authorization": authHeader
            });
            return this.http.get<any>(`${restUrl}` + api, { headers });
        }));
    }

    postPlatformAPI(api: string, payload): Observable<any> {
        return forkJoin(
            from(service.getRestUrl()),
            from(user.getAuthHeader()),
        ).pipe(mergeMap((values: any) => {
            const [restUrl, authHeader] = values;
            let headers = new HttpHeaders({
                "Content-type": "application/json",
                "Authorization": authHeader
            });
            return this.http.post<any>(`${restUrl}` + api, JSON.stringify(payload), { headers });
        }));
    }    
}

@Injectable()
export class UsuariosService {
    constructor(private client: PlatformClient) { }

    getDadosUsuario(): Observable<any> {
        return this.client.getPlatformAPI('usuarios/userManager/queries/obterMeusDados');
    }

    getUsuarios(): Observable<any> {
        return this.client.getPlatformAPI('usuarios/userManager/queries/listaUsuarios');
    }
}

@Injectable()
export class NotificationService {
    constructor(private client: PlatformClient) { }

    sendNotification(destination: string, subject: string, content: string): Observable<any> {
        let data = {
            "notificationOrigin": "Tutorial",
            "notificationKind": "Operational",
            "notificationPriority": "None",
            "notificationSubject": subject,
            "notificationContent": content,
            "sourceDomain": "tutorial",
            "sourceService": "user-notifications",
            "destinationUsers": [destination]
        }
        return this.client.postPlatformAPI('platform/notifications/actions/notifyUser', data);
    }
}

@Injectable()
export class BlobService {
    constructor(private http: HttpClient, private client: PlatformClient) { }

    createArea(): Observable<any> {
        let data = {
            "domainName": "tutorial",
            "serviceName": "user-notifications",
            "areaSecret": "tutorial-user-notifications-secret"
        }
        return this.client.postPlatformAPI('platform/blob_service/actions/createArea', data);
    }

    requestUpload(objectId: string, fileName: string): Observable<any> {
        let data = {
            "domainName": "tutorial",
            "serviceName": "user-notifications",
            "areaSecret": "tutorial-user-notifications-secret",
            "requirements": ["External"],
            "targetObjectId": objectId,
            "fileName": fileName
        }
        return this.client.postPlatformAPI('platform/blob_service/actions/requestUpload', data);
    }    

    uploadFile(uri: string, content): Observable<any> {
        let headers = new HttpHeaders({
            "Content-type": "multipart/form-data"
        });
        return this.http.put<any>(uri, content, { headers });
    }

    commitFile(uploadDetails: RequestUploadResponse): Observable<any> {
        let data = {
            "domainName": "tutorial",
            "serviceName": "user-notifications",
            "areaSecret": "tutorial-user-notifications-secret",
            "release": true,
            "targetObject": uploadDetails.targetObjectId,
            "version": uploadDetails.version,
            "fileName": uploadDetails.fileName
        }
        return this.client.postPlatformAPI('platform/blob_service/actions/commitFile', data);
    }
    
    requestAccess(uploadDetails: RequestUploadResponse): Observable<any> {
        let data = {
            "domainName": "tutorial",
            "serviceName": "user-notifications",
            "areaSecret": "tutorial-user-notifications-secret",
            "targetObjectId": uploadDetails.targetObjectId,
            "version": uploadDetails.version,
            "token": uploadDetails.token,
            "requirements": ["External"],
            "fileName": uploadDetails.fileName
        }
        return this.client.postPlatformAPI('platform/blob_service/actions/requestAccess', data);
    } 
}