import { RequestInstance } from "./libs/request";
import { Response } from "./common/type";


declare module "vue/types/vue" {
    interface Vue {
        request: RequestInstance<Response>;
    }
}