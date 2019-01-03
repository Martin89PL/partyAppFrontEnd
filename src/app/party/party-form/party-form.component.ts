import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {PartyListsService} from '../../services/party-lists.service';
import {PartyTypeService} from '../../services/party-type.service';
import {SaveModalComponent} from './save-modal/save-modal.component';

@Component({
  selector: 'app-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.scss']
})
export class PartyFormComponent implements OnInit {

  partyForm: FormGroup;
  searchControl: FormControl;
  latitude: number;
  longitude: number;
  partyTypes = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private partyListsService: PartyListsService,
    private partyTypeService: PartyTypeService,
    private formBuilder: FormBuilder,
  ) { }

  @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild('modal') public savedPartyModal: SaveModalComponent;

  ngOnInit() {

    this.partyTypeService.getPartyTypesLists().subscribe((data: any) => {
      this.partyTypes = data.types;
    });

    this.partyForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'desc': [null, Validators.required],
      'startDate': [null , Validators.required],
      'endDate': [null, Validators.required],
      'partyType': [null, Validators.required],
      'private': [null]
    });

    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
        });
      });
    });
  }

  onSubmit() {
    this.partyForm.value.latitude = this.latitude;
    this.partyForm.value.longitude = this.longitude;
    const newParty = this.partyForm.value;

    /** @TODO if place is not found (lat, lng) not send request */
    if (this.partyForm.value.latitude !== undefined || this.partyForm.value.longitude !== undefined) {
      this.partyListsService.saveParty(newParty).subscribe((savedParty) => {
        this.savedPartyModal.show(savedParty);
      });
    }

    this.partyForm.reset();
    this.searchControl.setValue('');
  }
}

