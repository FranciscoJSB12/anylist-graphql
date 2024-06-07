import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class AuthResponse {
    
    @Field(() => String)
    token: string;

    @Field(() => User)//Los decoradores field son muy importantes, sin ellos no se le está diciendo a graphql qué campos va a tener.
    //Otro punto importante, observe que en el field se devuelve user, eso es porque se dijo en la entidad de usuario que también era un objectType, lo que permita regresar un objectType dentro de otro
    user: User;
}