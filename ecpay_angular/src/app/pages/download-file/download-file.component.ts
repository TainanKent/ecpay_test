import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment'

@Component({
  selector: 'app-download-file',
  imports: [ButtonModule, InputTextModule, InputNumberModule, FormsModule, DatePickerModule],
  templateUrl: './download-file.component.html',
  styleUrl: './download-file.component.css'
})
export class DownloadFileComponent {

  // injected HttpClient
  constructor(
    private http: HttpClient,
  ) {}

  info = {
    "BeginDate": new Date(),
    "EndDate": new Date(),
  }

  sendForm() {
    const data = document.getElementById("theForm") as HTMLFormElement

    data.submit()
  }

  csvText = ''

  getFile() {
    this.http.post('http://localhost:3000/downloadFile', {
      BeginDate: moment(this.info.BeginDate).format('yyyy-MM-DD'),
      EndDate: moment(this.info.EndDate).format('yyyy-MM-DD')
    })
    .subscribe((res: any) => {
      this.csvText = res.data

      /**
       *  注意事項
       * 中文乱码问题分析
       * utf-8保存的csv格式要讓Excel正常打開的话，必须加入在文件最前面加入BOM(Byte order mark)。
       *  \ufeff 是为了解决CSV中文亂碼问题
       */
      const blob = new Blob(["\ufeff" + this.csvText], { type: 'text/csv;charset=utf-8,' })
      saveAs(blob, "對帳檔案.csv");
    });
  }

  // get CheckMacValue() {
  //   return generateCheckValue(this.info)
  // }
}
