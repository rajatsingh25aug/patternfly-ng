import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutModalComponent } from './about-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AboutModalComponent],
  exports: [AboutModalComponent]
})
export class AboutModalModule {}
