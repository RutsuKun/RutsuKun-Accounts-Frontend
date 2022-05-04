import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpFormComponent implements OnInit, OnDestroy {
  uns$ = new Subject();
  @Output() code: EventEmitter<string> = new EventEmitter<string>();

  public inputOtp = this.fb.group({
    one: this.fb.control(null, Validators.required),
    two: this.fb.control(null, Validators.required),
    three: this.fb.control(null, Validators.required),
    four: this.fb.control(null, Validators.required),
    five: this.fb.control(null, Validators.required),
    six: this.fb.control(null, Validators.required),
  });


  @ViewChild('inputOtpOne', { static: true }) inputOtpOne: ElementRef<HTMLInputElement>;
  @ViewChild('inputOtpTwo', { static: true }) inputOtpTwo: ElementRef<HTMLInputElement>;
  @ViewChild('inputOtpThree', { static: true }) inputOtpThree: ElementRef<HTMLInputElement>;
  @ViewChild('inputOtpFour', { static: true }) inputOtpFour: ElementRef<HTMLInputElement>;
  @ViewChild('inputOtpFive', { static: true }) inputOtpFive: ElementRef<HTMLInputElement>;
  @ViewChild('inputOtpSix', { static: true }) inputOtpSix: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(0o0);
    
    this.subscribeInputOtp();
  }

  subscribeInputOtp() {
    this.inputOtp.get('one').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length > 0) {
        this.inputOtpTwo.nativeElement.focus();
        this.inputOtpTwo.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });

    this.inputOtp.get('two').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length < 1) {
        this.inputOtpOne.nativeElement.focus();
        this.inputOtpOne.nativeElement.setSelectionRange(0, 1);
      } else {
        this.inputOtpThree.nativeElement.focus();
        this.inputOtpThree.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });

    this.inputOtp.get('three').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length < 1) {
        this.inputOtpTwo.nativeElement.focus();
        this.inputOtpTwo.nativeElement.setSelectionRange(0, 1);
      } else {
        this.inputOtpFour.nativeElement.focus();
        this.inputOtpFour.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });

    this.inputOtp.get('four').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length < 1) {
        this.inputOtpThree.nativeElement.focus();
        this.inputOtpThree.nativeElement.setSelectionRange(0, 1);
      } else {
        this.inputOtpFive.nativeElement.focus();
        this.inputOtpFive.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });

    this.inputOtp.get('five').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length < 1) {
        this.inputOtpFour.nativeElement.focus();
        this.inputOtpFour.nativeElement.setSelectionRange(0, 1);
      } else {
        this.inputOtpSix.nativeElement.focus();
        this.inputOtpSix.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });

    this.inputOtp.get('six').valueChanges.pipe(takeUntil(this.uns$)).subscribe((value: string)=>{
      if(value.length < 1) {
        this.inputOtpFive.nativeElement.focus();
        this.inputOtpFive.nativeElement.setSelectionRange(0, 1);
      }
      
      this.sendCode();
    });
  }

  sendCode(): void {
    let code = '';

    Object.keys(this.inputOtp.controls).forEach( (key) =>{

      const value = this.inputOtp.get(key).value;

      if(value !== undefined && value !== null) {
        code += value;
      }

    })
    console.log(111111111111);
    
    this.code.emit(code);
  }

  ngOnDestroy(): void {
      this.uns$.next();
      this.uns$.complete();
  }
}
