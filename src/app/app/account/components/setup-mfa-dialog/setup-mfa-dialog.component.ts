import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountFacade } from '@core/store/account/account.facade';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { filter, pairwise, take, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './setup-mfa-dialog.component.html',
  styleUrls: ['./setup-mfa-dialog.component.css']
})
export class SetupMfaDialogComponent implements OnInit {

  public type: 'otp' = null;
  public activeStep = 0;
  public maxSteps = 3;

  public otpCode = '';

  mfaLoading$ = this.accountFacade.mfaLoading$;
  mfaData$ = this.accountFacade.mfaData$;
  mfaError$ = this.accountFacade.mfaError$;

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private accountFacade: AccountFacade
  ) { }

  ngOnInit(): void {
    if(this.config.data.type) {
      this.type = this.config.data.type;
    }
  }

  isSupportedMethod() {
    return this.type === 'otp';
  }

  nextStep() {

    if(this.activeStep + 1 === 1) {

      this.accountFacade.mfaInitFlow(this.type);

      this.mfaLoading$.pipe(pairwise(), filter(([prev, curr])=> !!prev && !curr), take(1)).subscribe(()=> {
        this.activeStep += 1;
        this.config.header = `Step ${this.activeStep} of ${this.maxSteps}`;
      })

    } else if(this.activeStep + 1 === 3) {
      this.accountFacade.mfaFinishFlow(this.otpCode);

      this.mfaLoading$.pipe(pairwise(), filter(([prev, curr])=> !!prev && !curr), take(1)).subscribe(()=> {
        this.accountFacade.mfaError$.pipe(take(1)).subscribe((error)=>{
          if(!error) {
            this.activeStep += 1;
            this.config.header = `Step ${this.activeStep} of ${this.maxSteps}`;
            return;
          }


        })

        
      })

    } else {
      this.activeStep += 1;
    }

    if(this.activeStep === 3 && this.type === 'otp') {
      // fetch recovery codes
    }
    this.config.header = `Step ${this.activeStep} of ${this.maxSteps}`;
  }

  backStep() {
    this.activeStep -= 1;
    if(this.activeStep === 0) {
      this.config.header = "Multi-factor authentication";
    } else {
      this.config.header = `Step ${this.activeStep} of ${this.maxSteps}`;
    }
  }



  getSecret(secret: string) {
    return secret.match(/.{1,4}/g).join(" ");
  }

  close() {
    this.ref.close();
  }

}
