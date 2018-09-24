import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,  Validators, FormBuilder } from '@angular/forms';
import { PartyTypeService } from '../../services/party-type.service';

@Component({
  selector: 'app-party-type',
  templateUrl: './party-type.component.html',
  styleUrls: ['./party-type.component.css']
})
export class PartyTypeComponent implements OnInit {

  public partyTypeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private partyTypeService: PartyTypeService
  ) { }

  ngOnInit() {

    this.partyTypeForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'desc': [null, Validators.required],
      'icon': ['', Validators.required]
    });

  }

  onSubmit() {

    console.log(this.partyTypeForm.value);

    // this.partyTypeService.create(JSON.stringify(this.partyTypeForm.value)).subscribe((data: any) => {
    //   console.log(data);
    // });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.partyTypeForm.get('icon').setValue(file ? file.name : '');


      };
    }
  }

}