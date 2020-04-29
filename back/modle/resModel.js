class BaseModal {
    constructor(data, msg) {
        if (typeof data === 'string') {
            this.msg = data;
            data = null;
            msg = null;
        }
        if (data) {
            this.data = data;
        }
        if (msg) {
            this.msg = msg;
        }
    }
}
 class SuccessModal extends BaseModal{
     constructor(data, msg){
         super(data, msg);
         this.code = 0;
     }
 }

 class ErroModal extends BaseModal {
     constructor(data, msg) {
         super(data, msg);
         this.code = -1;
     }    
 }

 module.exports = {
     SuccessModal,
     ErroModal
 } 