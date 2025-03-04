import { Routes } from '@angular/router';
import { CreateOrderComponent } from './pages/create-order/create-order.component'
import { GetOrderComponent } from './pages/get-order/get-order.component'
import { DownloadFileComponent } from './pages/download-file/download-file.component'

export const routes: Routes = [
    { path: 'createOrder', component: CreateOrderComponent },
    { path: 'getOrder', component: GetOrderComponent },
    { path: 'download', component: DownloadFileComponent },
];
