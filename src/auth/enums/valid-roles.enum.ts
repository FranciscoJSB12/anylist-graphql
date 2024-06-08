import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    admin = 'admin',
    user = 'user',
    superUser = 'superUser'
}

//Una vez se declara la enumeración se debe registrar con register enum type
registerEnumType(ValidRoles, { name: 'ValidRoles', description: 'Roles del usuario' });

