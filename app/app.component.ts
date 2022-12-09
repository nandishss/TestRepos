import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { StepperComponent } from "@progress/kendo-angular-layout";

@Component({
  selector: "my-app",
  template: `
    <div class="example">
      <kendo-stepper
        #stepper
        [steps]="steps"
        [stepType]="'full'"
        [(currentStep)]="currentStep"
        [style.width.px]="550"
      >
      </kendo-stepper>

      <div class="content">
        <form class="k-form" [formGroup]="form">
          <account-details
            *ngIf="currentStep === 0"
            [accountDetails]="currentGroup"
          ></account-details>

          <personal-details
            *ngIf="currentStep === 1"
            [personalDetails]="currentGroup"
          ></personal-details>

          <payment-details
            *ngIf="currentStep === 2"
            [paymentDetails]="currentGroup"
          ></payment-details>

          <span class="k-form-separator"></span>
          <div class="k-form-buttons k-buttons-end">
            <span class="page">Step {{ currentStep + 1 }} of 3</span>
            <div>
              <button
                class="k-button"
                *ngIf="currentStep !== 0"
                (click)="prev()"
              >
                Previous
              </button>
              <button class="k-button k-primary" (click)="next()">
                {{ currentStep !== 2 ? "Next" : "Submit" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .example {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .k-stepper {
        align-self: center;
      }
      .k-step {
        pointer-events: none;
      }
      .example .content {
        align-self: center;
      }
      .k-form-separator {
        margin-top: 40px;
      }
      .k-buttons-end {
        justify-content: space-between;
        align-content: center;
      }
      .page {
        align-self: center;
      }
      .k-form {
        width: 450px;
      }
    `
  ]
})
export class AppComponent {
  public currentStep = 0;
  @ViewChild("stepper", { static: true })
  public stepper: StepperComponent;

  public steps = [
    {
      label: "Account Details",
      isValid: this.isStepValid.bind(this),
      validate: this.shouldValidate.bind(this)
    },
    {
      label: "Personal Details",
      isValid: this.isStepValid.bind(this),
      validate: this.shouldValidate.bind(this)
    },
    {
      label: "Payment Details",
      isValid: this.isStepValid.bind(this),
      validate: this.shouldValidate.bind(this)
    }
  ];

  public form = new FormGroup({
    accountDetails: new FormGroup({
      userName: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      avatar: new FormControl(null)
    }),
    personalDetails: new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      about: new FormControl("")
    }),
    paymentDetails: new FormGroup({
      paymentType: new FormControl(null, Validators.required),
      cardNumber: new FormControl("", Validators.required),
      cvc: new FormControl("", [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]),
      expirationDate: new FormControl("", Validators.required),
      cardHolder: new FormControl("", Validators.required)
    })
  });

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  public next(): void {
    if (this.currentGroup.valid && this.currentStep !== this.steps.length) {
      this.currentStep += 1;
      return;
    }

    this.steps = this.steps.map(step => ({ ...step }));
    this.currentGroup.markAllAsTouched();
  }

  public prev() {
    this.currentStep -= 1;
  }

  private isStepValid(index: number): boolean {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  }

  private shouldValidate(index: number): boolean {
    return this.getGroupAt(index).touched && this.currentStep >= index;
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map(groupName =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }
}
