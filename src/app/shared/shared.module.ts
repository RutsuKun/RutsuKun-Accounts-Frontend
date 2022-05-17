import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

// primeng
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { InputMaskModule } from "primeng/inputmask";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { InputTextareaModule } from "primeng/inputtextarea";
import { SelectButtonModule } from "primeng/selectbutton";
import { ChipsModule } from "primeng/chips";
import { StyleClassModule } from "primeng/styleclass";
import { TooltipModule } from "primeng/tooltip";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { AvatarModule } from "primeng/avatar";
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabMenuModule } from 'primeng/tabmenu';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ClipboardModule } from "@angular/cdk/clipboard";
import { AuthFooterComponent } from "@shared/components/auth-footer/auth-footer.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { OtpFormComponent } from './components/otp-form/otp-form.component';
import { HeaderAccountComponent } from './components/header-account/header-account.component';

@NgModule({
  declarations: [AuthFooterComponent, OtpFormComponent, HeaderAccountComponent],
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    TagModule,
    InputTextareaModule,
    SelectButtonModule,
    ChipsModule,
    StyleClassModule,
    TooltipModule,
    DynamicDialogModule,
    TableModule,
    DropdownModule,
    AvatarModule,
    TabViewModule,
    CheckboxModule,
    MenuModule,
    ImageModule,
    InputNumberModule,
    TabMenuModule,
    ClipboardModule,
    AuthFooterComponent,
    OtpFormComponent,
    HeaderAccountComponent,
  ],
})
export class SharedModule {}
