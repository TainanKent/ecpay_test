import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import moment  from 'moment'
import generateCheckValue from '../../js/checkValue'

@Component({
  selector: 'app-create-order',
  imports: [ButtonModule, InputTextModule, InputNumberModule, FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  MerchantTradeDate = moment().format('YYYY/MM/DD HH:mm:ss')
  ecpaydata = {
    "MerchantID": "3002607",
    "MerchantTradeNo": 'test' + new Date().getTime(),
    "MerchantTradeDate": this.MerchantTradeDate,
    "PaymentType": "aio",
    "TotalAmount": 15200,
    "TradeDesc": "test",
    "ItemName": "iphone 12",
    "ReturnURL": "https://ecpaytestapi-486408712223.us-central1.run.app",
    "ChoosePayment": "Credit",
    "EncryptType": 1
  }


  get CheckMacValue() {
    return generateCheckValue(this.ecpaydata)
  }

  sendForm() {
    const data = document.getElementById("theForm") as HTMLFormElement

    data.submit()
  }

}
