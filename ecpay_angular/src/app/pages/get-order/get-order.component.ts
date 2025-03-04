import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-order',
  imports: [ButtonModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './get-order.component.html',
  styleUrl: './get-order.component.css'
})
export class GetOrderComponent {
  // injected HttpClient
  constructor(
    private http: HttpClient,
  ) {

  }

  orderInfo = {
    "MerchantID": '',
    "MerchantTradeNo": '',
    "PaymentDate": '',
    "PaymentType": '',
    "TradeAmt": '',
    "TradeDate": '',
    "ItemName": '',
    "PaymentTypeChargeFee": '',
    "TradeStatus": '',
  }

  getOrderData(orderid: string) {
    this.http.post('http://localhost:3000/getOrder', {
      orderid: orderid
    }).subscribe((res: any) => {
      this.orderInfo = res
    });
  }

}
