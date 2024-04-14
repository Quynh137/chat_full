import { User } from "@/common/interface/User";
import { Response } from "@/common/types/res/response.type";
import { setCookie } from "@/common/utils/cookie";
import { fetcher } from "@/common/utils/fetcher";

export type AuthDto = {
     token: any;
     user: User;
}

class AuthServices {
     // LOGIN
     async login(payload: any): Promise<AuthDto | any> {
          
          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/login',
               payload: payload
          });

          if (res?.status === 200) {
               // Token
               const token = res?.data?.token;

               // Save token
               setCookie('token', token.accessToken, token?.expiration);

               // Save user
               setCookie('user', res?.data?.user, token?.expiration);

               // Return data
               return Promise.resolve(res?.data);
          }
          

          // Return error
          return Promise.resolve(false);
     }

     // LOGIN
     async register(payload: any): Promise<boolean> {
          
          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/register',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }
          

          // Return error
          return Promise.resolve(false);
     }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthServices();