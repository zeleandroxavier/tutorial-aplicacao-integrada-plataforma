import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { service, user } from '@seniorsistemas/senior-platform-data';
import { Observable, forkJoin, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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