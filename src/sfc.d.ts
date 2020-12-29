
import { RequestInstance } from "./libs/request";
import { Response } from "./common/api";

declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}

declare module "vue/types/vue" {
    interface Vue {
        request: RequestInstance<Response>;
    }
}
