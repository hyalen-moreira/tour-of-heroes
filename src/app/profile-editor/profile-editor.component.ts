import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CLICK_EVENTS, NAMES } from '../examples/shared/constants/notification-constants';
import { NotificationService } from '../examples/shared/service/notification.service';
import { NotificationStackComponent } from '../notification-stack/notification-stack.component';

@Component({
    selector: 'app-profile-editor',
    templateUrl: './profile-editor.component.html',
    styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild("topStack") topStack!: NotificationStackComponent;
    @ViewChild("downStack") downStack!: NotificationStackComponent;

    // Subscriptions
    private dataSubscriptions: Subscription = new Subscription();
    private formControlSubscriptions: Subscription = new Subscription();
    private formLogicSubscriptions: Subscription = new Subscription();
    private notificationSubscriptions: Subscription = new Subscription();
    public formGroup!: FormGroup;
    
    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService) {
        // Add initialization here
    }

    ngOnInit(): void {
        // TODO
        // if (this.uiStateService.repopulateForm)
        //     this.repopulateFormGroup();
        // else
            this.createFormGroup();

        this.addFormControlSubscriptions();
        this.addDataSubscriptions();
        this.addFormLogicSubscriptions();

        // NotificationStackComponent.updateNotificationStack(this.topStack, NAMES.DUPLICATED_USER, true);
    }

    ngAfterContentInit(): void {
        this.addNotificationSubscriptions();
    }

    ngOnDestroy(): void {
        if (this.dataSubscriptions)
            this.dataSubscriptions.unsubscribe();

        if (this.formControlSubscriptions)
            this.formControlSubscriptions.unsubscribe();

        if (this.formLogicSubscriptions)
            this.formLogicSubscriptions.unsubscribe();

        if (this.notificationSubscriptions)
            this.notificationSubscriptions.unsubscribe();
    }

    createFormGroup(): void {
        // this.formGroup = new FormGroup({
        //     firstName: new FormControl(''),
        //     lastName: new FormControl(''),
        //     address: new FormGroup({
        //         street: new FormControl(''),
        //         city: new FormControl(''),
        //         state: new FormControl(''),
        //         zip: new FormControl('')
        //     })
        // });

        // The same as above but using FormBuilder
        // You can define the control with just the initial value, but if your controls need sync or async validation, 
        // add sync and async validators as the second and third items in the array.
        this.formGroup = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: [''],
            address: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                zip: ['']
            }),
            aliases: this.formBuilder.array([
                this.formBuilder.control('')
            ])
        });
    }

    // --------------------- Form Repopulation Functions -------

    repopulateFormGroup(): void {
        // TODO
    }

    // --------------------- Data Subscriptions & Functions -------

    addDataSubscriptions(): void {
        // TODO
    }

    // --------------------- Form Control Subscriptions & Functions -------

    addFormControlSubscriptions(): void {
        this.formControlSubscriptions.add(
            this.formGroup.get('firstName')?.valueChanges.subscribe(value => {
                this.handleFirstNameChange(value);
            })
        );

        this.formControlSubscriptions.add(
            this.formGroup.get('address')?.get('zip')?.valueChanges.subscribe(value => {
                this.handleZipCodeChange(value);
            })
        );
    }

    handleFirstNameChange(value: string): void {
        if (value == 'Gabriela')
            this.notificationService.pushShowDuplicatedUserNotification(true);
    }

    handleZipCodeChange(value: string): void {
        if (value.length == 9)
            this.notificationService.pushShowInvalidZipCodeNotification(true);
    }

    // --------------------- Form Logic Subscriptions & Functions -------

    addFormLogicSubscriptions(): void {

    }

    // --------------------- Notification Subscriptions & Functions -------

    addNotificationSubscriptions(): void {
        this.notificationSubscriptions.add(
            this.notificationService.showDuplicatedUserNotification$.subscribe((displayNotification: boolean) => {
                NotificationStackComponent.updateNotificationStack(this.topStack, NAMES.DUPLICATED_USER, displayNotification);
            })
        );
        
        this.notificationSubscriptions.add(
            this.notificationService.showInvalidZipCodeNotification$.subscribe((displayNotification: boolean) => {
                NotificationStackComponent.updateNotificationStack(this.downStack, NAMES.INVALID_ZIP_CODE, displayNotification);
            })
        );
    }

    handleNotificationButtonClick(eventName: string): void {
        switch(eventName) {
            case CLICK_EVENTS.CLICK_EVENT_ONE:
                this.notificationService.pushShowDuplicatedUserNotification(false);
                console.log("First click event ...");
                break;
            case CLICK_EVENTS.CLICK_EVENT_TWO:
                this.notificationService.pushShowInvalidZipCodeNotification(false);
                console.log("Second click event ...");
                break;
        }
    }

    // --------------------- Other Functions -------

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.formGroup.value);
    }

    updateProfile() {
        this.formGroup.patchValue({
            firstName: 'Nancy',
            address: {
                street: '123 Drew Street'
            }
        });
    }

    get aliases() {
        // Because the returned control is of the type AbstractControl, you need to provide an explicit type 
        // to access the method syntax for the form array instance.
        return this.formGroup.get('aliases') as FormArray;
    }

    addAlias() {
        this.aliases.push(this.formBuilder.control(''));
    }
}
