import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    modelForm = this.fb.group({
        name: [],
        document_type: ['CC'],
        document_number: [],
        nacimiento: [],
        email: [],
        phone_ind: ['57'],
        phone_number: [],
        password: []
    });

    options = {
        phone_ind: [
            {
                id: '57',
                phone_code: '57',
                name: 'Colombia'
            }
        ],
        documents: [
            {
                id: 'CC',
                name: 'Cédula de ciudadanía'
            },
            {
                id: 'CE',
                name: 'Cédula de extranjería'
            }
        ]
    }

    constructor(private fb: UntypedFormBuilder, private http: HttpClient) { }

    fecthPerson(documentNumber: string, documentType: string) {
        this.http.post<any>('https://api.dasdra.com/api/Validation/FetchPerson/', {
            documentNumber,
            documentType
        }).subscribe(x => {
            this.modelForm.patchValue({
                name: x.fullName,
            });
        })
    }

    ngOnInit(): void {
        this.modelForm.valueChanges
            .pipe(debounceTime(2000))
            .subscribe(x => this.fecthPerson(x.document_number, x.document_type));
    }

}
