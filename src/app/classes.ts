export class DadosUsuario {
    nome: string
    nomeCompleto: string
    descricao: string
    email: string
    tenantDomain: string
    tenantName: string
    tenantLocale: string
}

export class Papel {
    idPapel: string
    nome: string
    descricao: string
}

export class Usuario {
    idUsuario: string
    nome: string
    nomeCompleto: string
    descricao: string
    email: string
    bloqueado: boolean
    papeis: Papel[]
}

export class Location {
    protocol: string
    uri: string
}

export class RequestUploadResponse {
    domainName: string
    serviceName: string
    areaSecret: string
    targetObjectId: string
    version: string
    token: string
    fileName: string
    location: Location
}